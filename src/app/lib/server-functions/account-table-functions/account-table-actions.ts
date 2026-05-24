import bcrypt from 'bcryptjs';
import postgres from 'postgres';
import { error } from 'console';
import { cookies } from 'next/headers';
const sql = postgres(process.env.POSTGRES_NETLIFY_URL!, {ssl: 'require'});

async function getAccount() {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;
    if (!userId) {
        return null;
    }
    try{
        const user = await sql`
        SELECT id,email,username,streak
        FROM account
        where id = ${userId}
        `;
        return user[0]||null;
    }
    catch(error){
        console.error("Error:", error)
        return null;
    }
}

export async function accountLogin(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    const users = await sql`
      SELECT id, username, email, password, streak
      FROM account
      WHERE email = ${email}
    `;

    if (users.length === 0) {
      return { error: "Invalid email or password" };
    }

    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return { error: "Invalid email or password" };
    }

    const cookieStore = await cookies();
    cookieStore.set("userId", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
    }
  );

 } catch (error) {
    console.error("Login error:", error);
    return { error: "Login failed" };
  }
}
