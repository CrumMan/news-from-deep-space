import bcrypt from 'bcryptjs';
import postgres from 'postgres';
import { error } from 'console';
const sql = postgres(process.env.POSTGRES_NETLIFY_URL!, {ssl: 'require'});

async function getKeywordById(id: number) {
    try{
        const keyword = await sql`
        SELECT id,keyword,synonyms
        FROM keyword
        where id = ${id}
        `;
        return keyword||null;
    }
    catch(error){
        console.error("Error:", error)
        return null;
    }
}
