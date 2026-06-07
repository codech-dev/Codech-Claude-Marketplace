# Recipe — Field-Level Encryption (Python / SQLAlchemy / Phase 5)

## Stack scope

**This recipe is a reference implementation for ONE stack:** Python + `cryptography` library + SQLAlchemy `TypeDecorator` + Postgres.

The **stack-agnostic decisions** (apply these regardless of language):

- **AES-256-GCM (random IV)** for general confidential fields. Authenticated, fast, random ciphertext per write.
- **AES-256-SIV** for fields you must **look up by** (natural keys, indexed columns). Misuse-resistant deterministic encryption — same plaintext + same key → same ciphertext, so equality queries work.
- **Keys loaded from environment** at app boot. Never in code. Never committed. Two 32-byte keys (one for GCM, one for SIV — SIV takes 64 bytes / two 256-bit halves).
- **Encrypted columns are stored as the DB's binary type** (`bytea` / `varbinary` / `BLOB`). The encryption layer is **application-side**; the DB driver doesn't know.
- **Never use `EncryptedStr` (random IV) on indexed/lookup columns** — equality won't match.
- **Never use deterministic encryption on low-entropy values** (birth year, country code) — leaks via equality on small ranges.

The **binding-layer decisions** below are Python-specific:
- `SQLAlchemy.TypeDecorator` with `impl = LargeBinary`
- `cryptography.hazmat.primitives.ciphers.aead.AESGCM` / `AESSIV`
- Alembic migrations declare columns as `LargeBinary`

For other stacks, the algorithms and key-handling rules above still apply; the binding mechanism differs (TypeORM `transformer`, Prisma middleware / field-level encryption preview, Django field, Hibernate AttributeConverter, sqlc scan hooks, etc.).

---

> When the SAD specifies field-level encryption (PDPO, HIPAA, GDPR sensitive fields), wire this in **from the foundation sub-plan**. Retrofitting AES-GCM/SIV onto existing rows is painful.

## Goals

- **AES-256-GCM** for general confidential fields (random IV, authenticated)
- **AES-256-SIV** for fields that need deterministic encryption (so we can query by them or use them as a unique key) — same plaintext + same key → same ciphertext, but the algorithm is misuse-resistant
- SQLAlchemy `TypeDecorator` so the encryption is invisible to the rest of the app
- Keys loaded from env at app startup (never from code, never committed)

## Dependencies

```toml
# pyproject.toml
[project]
dependencies = [
  "cryptography>=42",
  "sqlalchemy>=2",
  "sqlmodel>=0.0.22",
]
```

## Key material

Two 32-byte keys, base64-encoded in env:

```bash
# .env (NEVER committed)
CGG_ENC_KEY_GCM=base64url(32 random bytes)
CGG_ENC_KEY_SIV=base64url(64 random bytes)   # SIV uses two 256-bit keys
```

Generate once per environment:

```python
import base64, os
print("CGG_ENC_KEY_GCM=" + base64.urlsafe_b64encode(os.urandom(32)).decode())
print("CGG_ENC_KEY_SIV=" + base64.urlsafe_b64encode(os.urandom(64)).decode())
```

**Rotate by re-encrypting all rows.** Add a `key_version` byte prefix to ciphertext if you anticipate rotation.

## `app/core/encryption.py`

```python
import base64
import os
import secrets
from cryptography.hazmat.primitives.ciphers.aead import AESGCM, AESSIV
from sqlalchemy.types import LargeBinary, String, TypeDecorator

# Load once at import. Fail loudly if missing — better than silently writing plaintext.
def _load_key(name: str, expected_len: int) -> bytes:
    raw = os.environ.get(name)
    if not raw:
        raise RuntimeError(f"Missing env var {name}")
    key = base64.urlsafe_b64decode(raw)
    if len(key) != expected_len:
        raise RuntimeError(f"{name} must decode to {expected_len} bytes, got {len(key)}")
    return key

_GCM_KEY = _load_key("CGG_ENC_KEY_GCM", 32)
_SIV_KEY = _load_key("CGG_ENC_KEY_SIV", 64)

_gcm = AESGCM(_GCM_KEY)
_siv = AESSIV(_SIV_KEY)


class EncryptedStr(TypeDecorator):
    """AES-256-GCM with a random 12-byte nonce. Use for normal sensitive strings."""

    impl = LargeBinary
    cache_ok = True

    def process_bind_param(self, value, dialect):
        if value is None:
            return None
        if not isinstance(value, str):
            value = str(value)
        nonce = secrets.token_bytes(12)
        ct = _gcm.encrypt(nonce, value.encode("utf-8"), None)
        return nonce + ct                    # store nonce + ciphertext

    def process_result_value(self, value, dialect):
        if value is None:
            return None
        nonce, ct = value[:12], value[12:]
        return _gcm.decrypt(nonce, ct, None).decode("utf-8")


class DeterministicEncryptedStr(TypeDecorator):
    """AES-256-SIV — same plaintext + same key → same ciphertext.

    Use ONLY for fields you must look up by (e.g. natural keys, indexed lookups).
    Same plaintext leaks equality, so do not use for high-cardinality PII like names.
    """

    impl = LargeBinary
    cache_ok = True

    def process_bind_param(self, value, dialect):
        if value is None:
            return None
        if not isinstance(value, str):
            value = str(value)
        # AES-SIV with empty associated data array → deterministic on plaintext only
        return _siv.encrypt(value.encode("utf-8"), [])

    def process_result_value(self, value, dialect):
        if value is None:
            return None
        return _siv.decrypt(value, []).decode("utf-8")
```

## Using it in a model

```python
from sqlmodel import Field, SQLModel
from app.core.encryption import EncryptedStr, DeterministicEncryptedStr

class Member(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    # Lookup key — needs to be deterministic
    member_no: str = Field(sa_type=DeterministicEncryptedStr, index=True, unique=True)
    # PII — random encryption
    name_zh_hant: str = Field(sa_type=EncryptedStr)
    name_en: str | None = Field(default=None, sa_type=EncryptedStr)
    email: str | None = Field(default=None, sa_type=EncryptedStr)
```

The rest of the app sees plaintext strings. SQL queries that filter on `member_no` work because identical plaintexts produce identical ciphertexts.

## Queries

```python
# Lookup by deterministic field — works as-is, ciphertext matches in DB
member = db.exec(select(Member).where(Member.member_no == "M-00012")).first()

# Lookup by random-encrypted field — does NOT work this way; you'd need to scan & decrypt
# Don't put indexes/lookups on EncryptedStr columns. Move to DeterministicEncryptedStr if you must.
```

## Migration notes

Alembic migrations should declare columns as `LargeBinary` (the underlying `impl`). The TypeDecorator runs at the application layer, not at the DB layer — Alembic doesn't see the encryption.

```python
# alembic/versions/xxx_add_members.py
def upgrade():
    op.create_table(
        "members",
        sa.Column("id", sa.UUID(), primary_key=True),
        sa.Column("member_no", sa.LargeBinary(), nullable=False, unique=True),
        sa.Column("name_zh_hant", sa.LargeBinary(), nullable=False),
        sa.Column("name_en", sa.LargeBinary(), nullable=True),
        sa.Column("email", sa.LargeBinary(), nullable=True),
    )
    op.create_index("ix_members_member_no", "members", ["member_no"], unique=True)
```

## Tests

```python
def test_encrypted_round_trip(db):
    m = Member(member_no="M-00001", name_zh_hant="陳大文")
    db.add(m); db.commit(); db.refresh(m)

    # Plaintext on the Python side
    assert m.name_zh_hant == "陳大文"

    # Ciphertext in the DB
    row = db.execute(text("SELECT name_zh_hant FROM members WHERE id = :id"), {"id": m.id}).fetchone()
    assert row[0] != b"\xe9\x99\xb3\xe5\xa4\xa7\xe6\x96\x87"   # not the plaintext bytes


def test_deterministic_lookup(db):
    db.add(Member(member_no="M-00007", name_zh_hant="A"))
    db.commit()
    # Two encryptions of the same value produce the same ciphertext → equality query works
    found = db.exec(select(Member).where(Member.member_no == "M-00007")).first()
    assert found is not None
```

## What NOT to do

- Do not commit keys. Add `.env*` to `.gitignore`. Use a secrets manager in production.
- Do not use `EncryptedStr` on a column you need to query by — it can't equality-match.
- Do not use `DeterministicEncryptedStr` for low-entropy PII (e.g. birth year, country code) — leaks via equality on small ranges.
- Do not encrypt audit log payloads as a blob — instead, encrypt the sensitive **fields** within them so the action/actor are still queryable.
- Do not use AES-GCM with a fixed nonce — the GCM auth tag breaks on nonce reuse with the same key.
- Do not roll your own (e.g. `Fernet` without thinking about deterministic needs) — it doesn't solve the indexed-lookup problem.

## Operational notes

- Key rotation: write a one-shot migration that decrypts with the old key + re-encrypts with the new, in chunks.
- Backup: encrypted columns in `pg_dump` are safe to store with normal backups. Backups don't need extra encryption beyond your normal storage layer.
- Debugging: when looking at the DB directly (`psql`), encrypted columns are `\x...` bytes. Decrypt via a small Python script that imports the same `EncryptedStr` decoder.
