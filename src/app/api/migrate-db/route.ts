import { NextResponse } from "next/server";
import { sql } from "../../lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  return handleMigration();
}

export async function POST() {
  return handleMigration();
}

async function handleMigration() {
  try {
    // Fix account table structure
    await sql`
      DO $$ 
      BEGIN
        -- Drop the problematic email column if it exists
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'account' AND column_name = 'email') THEN
          ALTER TABLE account DROP COLUMN email CASCADE;
        END IF;
        
        -- Drop the problematic password column if it exists
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'account' AND column_name = 'password') THEN
          ALTER TABLE account DROP COLUMN password CASCADE;
        END IF;
        
        -- Ensure password_hash exists and is correct
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'account' AND column_name = 'password_hash') THEN
          -- Make sure it's NOT NULL
          ALTER TABLE account ALTER COLUMN password_hash SET NOT NULL;
        ELSE
          -- Add it if it doesn't exist
          ALTER TABLE account ADD COLUMN password_hash TEXT NOT NULL DEFAULT '';
        END IF;
        
        -- Add missing columns to account table if they don't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'account' AND column_name = 'streak') THEN
          ALTER TABLE account ADD COLUMN streak INT NOT NULL DEFAULT 0;
        ELSE
          -- Ensure streak has default value
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

    // Add missing columns to keyword table
    await sql`
      DO $$ 
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'keyword' AND column_name = 'created_at') THEN
          ALTER TABLE keyword ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
        END IF;
      END $$;
    `;

    // Add missing columns to combined_keywords table
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

    // Ensure indexes exist
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
        "Database fixed - removed email and password columns, ensured correct account table structure",
    });
  } catch (error) {
    console.error("Migration failed:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
