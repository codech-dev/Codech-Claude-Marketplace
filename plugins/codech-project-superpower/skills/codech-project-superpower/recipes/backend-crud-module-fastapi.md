# Recipe — Backend CRUD Module (FastAPI / Phase 5)

## Stack scope

**This recipe is a reference implementation for ONE stack:** FastAPI + SQLModel + Alembic + Postgres + pytest. **Do NOT apply file paths or library names verbatim if your stack differs.**

The **universal pattern** lives in `SKILL.md §5.6 — Module sub-plan template`. The four axes (file-per-responsibility module layout, shared CRUD helper, typed error hierarchy, audit-write-in-same-transaction) are the contract; this recipe shows one way to satisfy them.

For other stacks, add a sibling recipe (e.g. `backend-crud-module-nestjs.md`, `backend-crud-module-rails.md`, `backend-crud-module-go.md`) implementing the same four axes. The SKILL.md §5.6 table sketches the file-layout equivalents.

---

> One module = one folder. Same layout everywhere. Shared `_crud.py` for the repetitive list/get/audit work. AppError hierarchy keeps the router thin.

## Folder layout

```
apps/api/app/
├── core/
│   ├── _crud.py              # shared list_all / get_or_404 / write_audit_event
│   ├── errors.py             # AppError hierarchy
│   ├── audit.py              # write_audit_event()
│   ├── deps.py               # get_db / get_current_user / require_role
│   └── encryption.py         # EncryptedStr / DeterministicEncryptedStr (see field-level-encryption.md)
└── modules/
    └── <name>/
        ├── __init__.py
        ├── models.py         # SQLModel tables
        ├── schemas.py        # pydantic in/out shapes
        ├── service.py        # business logic; no FastAPI types here
        ├── router.py         # FastAPI routes; only validation + dep wiring + service calls
        └── tests/
            ├── test_service.py
            └── test_router.py
```

**Rule:** `service.py` must be importable without FastAPI. `router.py` may import from service but not vice versa. This makes the service layer testable with plain pytest and lets it be reused (e.g. by a CLI or ARQ worker) without dragging in HTTP.

## `models.py`

```python
from datetime import datetime
from uuid import UUID, uuid4
from sqlmodel import Field, SQLModel
from app.core.encryption import EncryptedStr, DeterministicEncryptedStr

class Location(SQLModel, table=True):
    __tablename__ = "locations"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    code: str = Field(sa_type=DeterministicEncryptedStr, index=True, unique=True)
    name_zh_hant: str = Field(sa_type=EncryptedStr)
    type: str
    area_sqm: float | None = None
    capacity: float | None = None
    capacity_unit: str | None = None
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

## `schemas.py`

```python
from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, Field

class LocationBase(BaseModel):
    code: str = Field(min_length=1, max_length=32)
    name_zh_hant: str = Field(min_length=1, max_length=128)
    type: str
    area_sqm: float | None = None
    capacity: float | None = None
    capacity_unit: str | None = None

class LocationCreate(LocationBase):
    pass

class LocationUpdate(BaseModel):
    code: str | None = None
    name_zh_hant: str | None = None
    type: str | None = None
    area_sqm: float | None = None
    capacity: float | None = None
    capacity_unit: str | None = None
    is_active: bool | None = None

class LocationOut(LocationBase):
    id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime
```

## `service.py`

```python
from uuid import UUID
from sqlmodel import Session, select
from app.core._crud import get_or_404, list_all
from app.core.audit import write_audit_event
from app.core.errors import AppError
from .models import Location
from .schemas import LocationCreate, LocationUpdate

def list_locations(db: Session) -> list[Location]:
    return list_all(db, Location)

def get_location(db: Session, id: UUID) -> Location:
    return get_or_404(db, Location, id, error_msg="Location not found")

def create_location(db: Session, payload: LocationCreate, *, actor_id: UUID) -> Location:
    if db.exec(select(Location).where(Location.code == payload.code)).first():
        raise AppError("Location code already exists", code="LOCATION_CODE_EXISTS", status=409)
    loc = Location.model_validate(payload)
    db.add(loc)
    db.flush()                                                # get the id
    write_audit_event(db, actor_id=actor_id, action="location.create", target_id=loc.id, payload=payload.model_dump())
    db.commit()                                               # audit + insert in one tx
    db.refresh(loc)
    return loc

def update_location(db: Session, id: UUID, payload: LocationUpdate, *, actor_id: UUID) -> Location:
    loc = get_location(db, id)
    data = payload.model_dump(exclude_unset=True)
    for k, v in data.items():
        setattr(loc, k, v)
    write_audit_event(db, actor_id=actor_id, action="location.update", target_id=loc.id, payload=data)
    db.commit()
    db.refresh(loc)
    return loc

def delete_location(db: Session, id: UUID, *, actor_id: UUID) -> None:
    loc = get_location(db, id)
    db.delete(loc)
    write_audit_event(db, actor_id=actor_id, action="location.delete", target_id=loc.id, payload={})
    db.commit()
```

## `router.py`

```python
from uuid import UUID
from fastapi import APIRouter, Depends, status
from sqlmodel import Session
from app.core.deps import get_db, get_current_user, require_role
from app.core.errors import AppError
from . import service
from .schemas import LocationCreate, LocationOut, LocationUpdate

router = APIRouter(prefix="/locations", tags=["locations"])

@router.get("", response_model=list[LocationOut])
def list_locations(db: Session = Depends(get_db), _: object = Depends(require_role("admin", "ops"))):
    return service.list_locations(db)

@router.post("", response_model=LocationOut, status_code=status.HTTP_201_CREATED)
def create_location(
    payload: LocationCreate,
    db: Session = Depends(get_db),
    user = Depends(require_role("admin")),
):
    return service.create_location(db, payload, actor_id=user.id)

@router.patch("/{id}", response_model=LocationOut)
def update_location(
    id: UUID,
    payload: LocationUpdate,
    db: Session = Depends(get_db),
    user = Depends(require_role("admin")),
):
    return service.update_location(db, id, payload, actor_id=user.id)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_location(
    id: UUID,
    db: Session = Depends(get_db),
    user = Depends(require_role("admin")),
):
    service.delete_location(db, id, actor_id=user.id)
```

## Shared `_crud.py`

```python
from typing import Type, TypeVar
from uuid import UUID
from sqlmodel import Session, SQLModel, select
from .errors import AppError

T = TypeVar("T", bound=SQLModel)

def list_all(db: Session, model: Type[T]) -> list[T]:
    return list(db.exec(select(model)).all())

def get_or_404(db: Session, model: Type[T], id: UUID, *, error_msg: str = "Not found") -> T:
    obj = db.get(model, id)
    if obj is None:
        raise AppError(error_msg, code=f"{model.__name__.upper()}_NOT_FOUND", status=404)
    return obj
```

## `errors.py` — AppError hierarchy

```python
class AppError(Exception):
    def __init__(self, message: str, *, code: str, status: int = 400):
        super().__init__(message)
        self.message = message
        self.code = code
        self.status = status

class AuthError(AppError):
    def __init__(self, message: str, *, code: str = "AUTH_FAILED"):
        super().__init__(message, code=code, status=401)

class ForbiddenError(AppError):
    def __init__(self, message: str = "Forbidden", *, code: str = "FORBIDDEN"):
        super().__init__(message, code=code, status=403)
```

Wire one exception handler at the app root:

```python
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from app.core.errors import AppError

@app.exception_handler(AppError)
async def app_error_handler(_: Request, exc: AppError):
    return JSONResponse(status_code=exc.status, content={"code": exc.code, "message": exc.message})
```

## Tests (real DB, no mocks)

```python
# tests/test_service.py
from uuid import uuid4
from app.modules.locations import service
from app.modules.locations.schemas import LocationCreate

def test_create_location_writes_audit(db, admin_user):
    payload = LocationCreate(code="WH-A", name_zh_hant="A 倉", type="warehouse")
    loc = service.create_location(db, payload, actor_id=admin_user.id)
    assert loc.id is not None
    events = service.list_audit_events(db, target_id=loc.id)
    assert any(e.action == "location.create" for e in events)

def test_duplicate_code_rejected(db, admin_user):
    service.create_location(db, LocationCreate(code="WH-B", name_zh_hant="B 倉", type="warehouse"), actor_id=admin_user.id)
    with pytest.raises(AppError) as ei:
        service.create_location(db, LocationCreate(code="WH-B", name_zh_hant="B 倉 dup", type="warehouse"), actor_id=admin_user.id)
    assert ei.value.code == "LOCATION_CODE_EXISTS"
```

## Discipline checklist

- [ ] `service.py` has no FastAPI imports
- [ ] Every mutation calls `write_audit_event()` **before** `db.commit()` (audit + change in one tx)
- [ ] Every route is permissioned via `require_role(...)`
- [ ] Errors raised as `AppError`, not `HTTPException`
- [ ] Unique constraints enforced both at DB level and in service (clearer error code)
- [ ] Tests cover happy path + at least one error path
- [ ] No mocking of the DB — use a real test session (fixtures)

## Common mistakes

| Mistake | Fix |
|---|---|
| `write_audit_event` after `db.commit()` | Move it before; otherwise audit and entity can drift |
| `raise HTTPException` deep in service | Use `AppError`; one handler at the edge |
| Querying with `.first()` then null check | Use `get_or_404`; shared, consistent error |
| Forgetting `db.refresh(obj)` after commit | Returned object will be missing server-side defaults |
| Using `model.from_orm` (deprecated) | Use `Model.model_validate(payload)` (Pydantic v2) |
| Putting `is_active` on `LocationCreate` | Defaults belong on the model; don't expose them in Create |
