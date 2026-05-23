import bcrypt from 'bcryptjs';
import postgres from 'postgres';
import { error } from 'console';

const sql = postgres(process.env.NETLIFY_DATABASE_URL!, {ssl: 'require'});

async function seedKeyword(){
    await sql`
    CREATE TABLE IF EXISTS keyword(
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    keyword VARCHAR(100) NOT NULL,
    synonyms TEXT NOT NULL
    );
    `
}

async function seedCombinedKeywords(){
    await sql`
    CREATE TABLE IF NOT EXISTS combined_keywords(
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    fk_keyword1 UUID NOT NULL,
    fk_keyword2 UUID NOT NULL,
    
    type TEXT NOT NULL,
    link TEXT NOT NULL,
    complex_api_type TEXT 
    complex_link TEXT,
    key TEXT,

    
    CONSTRAINT fk_keyword1
        FOREIGN KEY (fk_keyword1)
        REFERENCES keyword(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_keyword2
        FOREIGN KEY (fk_keyword2)
        REFERENCES keyword(id)
        ON DELETE CASCADE
    );    
`
}

async function seedAccount(){
    await sql `
    CREATE TABLE IF NOT EXISTS account(
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT NOT NULL,
    username VARCHAR(40) NOT NULL,
    password TEXT NOT NULL,
    streak INT(4)
    );
    `
}