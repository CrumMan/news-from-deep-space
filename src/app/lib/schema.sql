CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS account (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username      VARCHAR(40) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  streak        INT NOT NULL DEFAULT 0,
  last_active   DATE,
  is_admin      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS keyword (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  keyword     VARCHAR(100) NOT NULL UNIQUE,
  synonyms    TEXT[] NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS combined_keywords (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fk_keyword1 UUID NOT NULL REFERENCES keyword(id) ON DELETE CASCADE,
  fk_keyword2 UUID NOT NULL REFERENCES keyword(id) ON DELETE CASCADE,
  type        TEXT NOT NULL CHECK (type IN ('api', 'link')),
  result      TEXT NOT NULL,
  api_key     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT no_self_combo CHECK (fk_keyword1 <> fk_keyword2)
);

CREATE UNIQUE INDEX IF NOT EXISTS combined_keywords_unordered_pair
  ON combined_keywords (
    LEAST(fk_keyword1, fk_keyword2),
    GREATEST(fk_keyword1, fk_keyword2)
  );

CREATE INDEX IF NOT EXISTS combined_keywords_fk_keyword1_idx
  ON combined_keywords (fk_keyword1);

CREATE INDEX IF NOT EXISTS combined_keywords_fk_keyword2_idx
  ON combined_keywords (fk_keyword2);
