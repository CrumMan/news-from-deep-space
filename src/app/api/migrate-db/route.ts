import { NextResponse } from "next/server";
import { sql } from "../../lib/db";
import { serverError } from "../../lib/api-helpers";

export const dynamic = "force-dynamic";

export async function GET() {
  return handleMigration();
}

export async function POST() {
  return handleMigration();
}

async function handleMigration() {
  try {
    await sql`
      DO $$ 
      BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'account' AND column_name = 'email') THEN
          ALTER TABLE account DROP COLUMN email CASCADE;
        END IF;
        
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'account' AND column_name = 'password') THEN
          ALTER TABLE account DROP COLUMN password CASCADE;
        END IF;
        
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'account' AND column_name = 'password_hash') THEN
          ALTER TABLE account ALTER COLUMN password_hash SET NOT NULL;
        ELSE
          ALTER TABLE account ADD COLUMN password_hash TEXT NOT NULL DEFAULT '';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'account' AND column_name = 'streak') THEN
          ALTER TABLE account ADD COLUMN streak INT NOT NULL DEFAULT 0;
        ELSE
          ALTER TABLE account ALTER COLUMN streak SET DEFAULT 0;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'account' AND column_name = 'last_active') THEN
          ALTER TABLE account ADD COLUMN last_active DATE;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'account' AND column_name = 'is_admin') THEN
          ALTER TABLE account ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT FALSE;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'account' AND column_name = 'created_at') THEN
          ALTER TABLE account ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
        END IF;
      END $$;
    `;

    await sql`
      DO $$ 
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'keyword' AND column_name = 'created_at') THEN
          ALTER TABLE keyword ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
        END IF;
      END $$;
    `;

    await sql`
      DO $$ 
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'combined_keywords' AND column_name = 'result') THEN
          ALTER TABLE combined_keywords ADD COLUMN result TEXT NOT NULL DEFAULT '';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'combined_keywords' AND column_name = 'api_key') THEN
          ALTER TABLE combined_keywords ADD COLUMN api_key TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'combined_keywords' AND column_name = 'created_at') THEN
          ALTER TABLE combined_keywords ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
        END IF;
      END $$;
    `;

    await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto`;

    await sql`
      CREATE INDEX IF NOT EXISTS combined_keywords_fk_keyword1_idx
        ON combined_keywords (fk_keyword1)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS combined_keywords_fk_keyword2_idx
        ON combined_keywords (fk_keyword2)
    `;

    return NextResponse.json({
      success: true,
      message:
        "Database repaired: legacy columns removed and schema aligned for registration",
    });
  } catch (error) {
    console.error("Migration failed:", error);
    return serverError(error instanceof Error ? error.message : "Migration failed");
  }
}
