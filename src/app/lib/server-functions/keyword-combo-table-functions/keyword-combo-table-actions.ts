import bcrypt from 'bcryptjs';
import postgres from 'postgres';
import { error } from 'console';
const sql = postgres(process.env.NETLIFY_DATABASE_URL!, {ssl: 'require'});

async function getKeywordComboById(id: number) {
    try{
        const keywordCombo = await sql`
        SELECT id,fk_keyword1,fk_keyword2,type,link,complex_api_type,complex_link,key
        FROM combined_keywords
        where id = ${id}
        `;
        return keywordCombo[0]||null;
    }
    catch(error){
        console.error("Error:", error)
        return null;
    }
}

async function getKeywordComboByKeywordId(keywordId: number) {
    try{
        const keywordCombo = await sql`
        SELECT id,fk_keyword1,fk_keyword2,type,link,complex_api_type,complex_link,key
        FROM combined_keywords
        where id = ${keywordId}
        `;
        return keywordCombo||null;
    }
    catch(error){
        console.error("Error:", error)
        return null;
    }
}
async function getAllKeywordCombos() {
    try{
        const keywordCombo = await sql`
        SELECT id,fk_keyword1,fk_keyword2,type,link,complex_api_type,complex_link,key
        FROM combined_keywords
        `;
        return keywordCombo||null;
    }
    catch(error){
        console.error("Error:", error)
        return null;
    }
}