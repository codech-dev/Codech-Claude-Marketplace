#!/usr/bin/env python3
"""Scan a portfolio pack for things that must not leave the building, before it's handed over.

    python scan_pack.py <pack-dir> [--client-domains client.com,client.co] [--fix-ips]

Reports, per file: secrets (API keys, tokens, private keys, passwords in env/config), .env files,
public IP addresses, real client hostnames, personal emails and phone numbers, and "confidential"
labels, plus files that don't belong in a pack (databases, dumps, archives, node_modules).
--fix-ips replaces public IPv4 addresses in text files with 203.0.113.x (documentation range).
Everything else is for a human to decide: a demo email in a mock screen is fine, a real one isn't.
"""
import argparse, pathlib, re

TEXT = {".md", ".txt", ".html", ".htm", ".css", ".js", ".ts", ".json", ".yml", ".yaml", ".env", ".csv", ".sql", ".py", ".sh", ".toml", ".ini", ".xml", ".svg"}
BAD_FILES = re.compile(r"(^|/)(\.env(\..*)?|id_rsa.*|.*\.pem|.*\.key|.*\.p12|.*\.sqlite3?|.*\.db|.*\.dump|.*\.bak|.*\.zip|.*\.tar(\.gz)?|node_modules/.*)$", re.I)
SECRET = [
    ("private key", r"-----BEGIN [A-Z ]*PRIVATE KEY-----"),
    ("OpenAI/Anthropic key", r"\bsk-(?:ant-|proj-)?[A-Za-z0-9_-]{20,}"),
    ("AWS key", r"\bAKIA[0-9A-Z]{16}\b"),
    ("GitHub token", r"\bgh[pousr]_[A-Za-z0-9]{30,}\b"),
    ("Slack/Stripe/Google key", r"\b(xox[baprs]-[A-Za-z0-9-]{10,}|sk_live_[A-Za-z0-9]{16,}|AIza[0-9A-Za-z_-]{35})\b"),
    ("JWT", r"\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}"),
    ("password literal", r"(?i)\b(pass(word)?|secret|api[_-]?key|access[_-]?token|auth[_-]?token)\b['\"]?\s*[:=]\s*['\"][^'\"\s]{8,}['\"]"),
    ("env secret", r"(?m)^\s*[A-Z0-9_]*(PASSWORD|SECRET|API_KEY|TOKEN|PRIVATE_KEY)[A-Z0-9_]*\s*=\s*\S{8,}"),
    ("connection string", r"\b(postgres(ql)?|mysql|mongodb(\+srv)?|redis|amqp)://[^\s'\"<>]+"),
]
PUBLIC_IP = re.compile(r"\b(?!10\.|127\.|0\.|192\.168\.|172\.(?:1[6-9]|2\d|3[01])\.|203\.0\.113\.|198\.51\.100\.|192\.0\.2\.)(?:\d{1,3}\.){3}\d{1,3}\b")
OTHER = [("email", r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"), ("phone", r"\+\d{2,3}[\s-]?\d{1,4}[\s-]?\d{3,4}[\s-]?\d{3,4}"),
         ("confidential label", r"(?i)\b(confidential|internal only|do not distribute|privileged)\b")]

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("pack"); ap.add_argument("--client-domains", default=""); ap.add_argument("--fix-ips", action="store_true")
    o = ap.parse_args(); root = pathlib.Path(o.pack); doms = [d.strip() for d in o.client_domains.split(",") if d.strip()]
    findings = 0
    for p in sorted(root.rglob("*")):
        if not p.is_file(): continue
        rel = p.relative_to(root).as_posix()
        if BAD_FILES.search(rel): print(f"REMOVE? {rel}  (file type doesn't belong in a pack)"); findings += 1; continue
        if p.suffix.lower() not in TEXT: continue
        txt = p.read_text(encoding="utf-8", errors="ignore"); hits = []
        for label, rx in SECRET:
            for m in re.finditer(rx, txt): hits.append(f"SECRET {label}: {m.group(0)[:40]}…")
        ips = sorted(set(PUBLIC_IP.findall(txt)))
        ips = [i for i in ips if all(0 <= int(x) <= 255 for x in i.split("."))]
        if ips:
            hits.append("public IP: " + ", ".join(ips[:8]))
            if o.fix_ips:
                for n, ip in enumerate(ips): txt = txt.replace(ip, f"203.0.113.{10 + n}")
                p.write_text(txt, encoding="utf-8"); hits[-1] += "  → replaced with 203.0.113.x"
        for d in doms:
            hs = sorted(set(re.findall(r"[a-z0-9.-]*" + re.escape(d), txt, re.I)))
            if hs: hits.append("client hostname: " + ", ".join(hs[:6]))
        for label, rx in OTHER:
            vs = sorted(set(re.findall(rx, txt)))
            if vs: hits.append(f"{label}: " + ", ".join(v if isinstance(v, str) else v[0] for v in vs[:6]) + (" …" if len(vs) > 6 else ""))
        if hits:
            findings += len(hits); print(f"\n{rel}"); [print("   " + h) for h in hits]
    print(f"\n{findings} item(s) to review. Secrets and .env files: remove. Real client hostnames/IPs: redact. "
          "Demo emails/phones in mock screens: fine. Confidential labels: ask the user.")

if __name__ == "__main__":
    import sys as _s; _s.stdout.reconfigure(encoding="utf-8", errors="replace")
    main()
