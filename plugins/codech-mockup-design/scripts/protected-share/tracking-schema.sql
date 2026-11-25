CREATE TABLE IF NOT EXISTS links (
  token   TEXT PRIMARY KEY,
  label   TEXT NOT NULL,
  site    TEXT NOT NULL,
  created INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS visits (
  id       TEXT PRIMARY KEY,
  ts       INTEGER NOT NULL,
  site     TEXT NOT NULL,
  path     TEXT NOT NULL,
  token    TEXT NOT NULL DEFAULT '',
  vid      TEXT NOT NULL DEFAULT '',
  ip       TEXT,
  country  TEXT,
  city     TEXT,
  org      TEXT,
  ua       TEXT,
  device   TEXT,
  referer  TEXT,
  expired  INTEGER NOT NULL DEFAULT 0,
  seconds  INTEGER NOT NULL DEFAULT 0,
  scroll   INTEGER NOT NULL DEFAULT 0,
  sections TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS visits_ts ON visits (ts DESC);
CREATE INDEX IF NOT EXISTS visits_token ON visits (token);
