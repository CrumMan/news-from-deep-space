import bcrypt from 'bcryptjs';
import postgres from 'postgres';
import { error } from 'console';
import { UUID } from 'crypto';
const sql = postgres(process.env.DATABASE_URL!, {ssl: 'require'});

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

async function getKeywordComboByKeywordId(keywordId: UUID) {
    try{
        const keywordCombo = await sql`
        SELECT id,fk_keyword1,fk_keyword2,type,link,complex_api_type,complex_link,key
        FROM combined_keywords
        WHERE fk_keyword1 = ${keywordId} OR fk_keyword2 = ${keywordId}
        `;
        return keywordCombo||null;
    }
    catch(error){
        console.error("Error:", error)
        return null;
    }
}
async function getKeywordComboByKeywordTwoIds(fk_keyword1: UUID, fk_keyword2: UUID) {
    try{
        const keywordCombo = await sql`
        SELECT id,fk_keyword1,fk_keyword2,type,link,complex_api_type,complex_link,key
        FROM combined_keywords
        WHERE (fk_keyword1 = ${fk_keyword1} AND fk_keyword2 = ${fk_keyword2})
        OR (fk_keyword2 = ${fk_keyword1} AND fk_keyword1 = ${fk_keyword2})
        `;
        return keywordCombo[0]||null;
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