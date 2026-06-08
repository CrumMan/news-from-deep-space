import { NextResponse } from "next/server";
import { sql } from "../../../lib/db";
import {
  badRequest,
  notFound,
  requireAdmin,
  serverError,
} from "../../../lib/api-helpers";

type UpdateBody = {
  id: string;
  type: string;
  subtitle:string | null;
  title:string | null;
  text:string|null;
  imageLinkWord:string|null;
  result: string;
  created_at?: string;
};

type CreateBody = {
  id: string;
  type: string;
  subtitle:string | null;
  title:string | null;
  text:string|null;
  imageLinkWord:string|null;
  result: string;
  created_at?: string;
};


type api_buildRow = {
  id: string;
  type: string;
  subtitle:string | null;
  title:string | null;
  text:string|null;
  imageLinkWord:string|null;
  result: string;
  created_at?: string;
}

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  try {
    const rows = await sql<api_buildRow[]>`
      SELECT
        a.id,
        a.type,
        a.subtitle,
        a.title,
        a.text, a.imageLinkWord, a.created_at
      FROM api_config a
      WHERE a.id = ${id}
    `;
    if(!rows.length) return NextResponse.json(null);
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Combination read failed", error);
    return serverError();
  }
}
export async function DELETE(request: Request, { params }: Params) {
  const { id } = await params;
  const auth = await requireAdmin(request);
  if (auth.ok === false) return auth.response;

  try {
    await sql` 
    DELETE FROM api_config 
    WHERE id = ${id}
    `;
    const rows = await sql<{ id: string }[]>`
    DELETE FROM combined_keywords WHERE id = ${id} RETURNING id
    `;
    if (!rows.length) {
        return NextResponse.json({ ok: true, deleted: false });
    }
    return NextResponse.json({ ok: true, id: rows[0].id });
  } catch (error) {
    console.error("Combination delete failed", error);
    return serverError();
  }
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const auth = await requireAdmin(request);
  if (auth.ok === false) return auth.response;

  let body: UpdateBody;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  if (body.type !== undefined && body.type !== "api" && body.type !== "photo") {
    return badRequest('type must be "photo" or "link"');
  }
  if (body.result !== undefined && body.result.trim().length === 0) {
    return badRequest("result cannot be empty");
  }
  if (
    body.type === undefined &&
    body.result === undefined &&
    body.id === undefined
  ) {
    return badRequest("Provide type, result, or id to update");
  }
  if(body.type==="link" &&(
    body.title === undefined &&
    body.text === undefined
  )){
    return badRequest("Provide Title or Text to update");
  }
  if((body.type === "photo") &&(
    body.title === undefined &&
    body.imageLinkWord === undefined
  )){
    return badRequest("Provide the proper image URL and title of the image")
  }
  try {
    const rows = await sql<{ id: string }[]>`
    UPDATE api_config SET
        type = COALESCE(${body.type ?? null}, type),
        title = COALESCE(${body.title?.trim() ?? null}, title),
        subtitle = COALESCE(${body.subtitle?.trim() ?? null}, subtitle),
        text = COALESCE(${body.text?.trim() ?? null}, text),
        imagelinkword = COALESCE(${body.imageLinkWord?.trim() ?? null}, imagelinkword)
    WHERE id = ${id}
    RETURNING id
`;
    if (rows.length === 0) return notFound("API_config not found");
    return NextResponse.json({ ok: true, id: rows[0].id });
  } catch (error) {
    console.error("API_config update failed", error);
    return serverError();
  }
}

export async function POST(request: Request, { params }: Params) {
  const { id } = await params;
  const auth = await requireAdmin(request);
  if (auth.ok === false) return auth.response;
  if(!id)return badRequest("api_cofig post Failure")
  let body: CreateBody;

  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const { type, result, text, title, subtitle, imageLinkWord  } = body;

  if (!text || !type || !title) {
    return badRequest("Text, type and title are required");
  }
  if (body.type == "photo" &&( !imageLinkWord )) {
    return badRequest("A api_config requires an image keyword");
  }
    if (body.type == "link" &&( !subtitle || !text )) {
    return badRequest('An api_conifg must have a subtitle or text');
  }
  try{
    const rows = await sql<{ id: string }[]>`
    INSERT INTO api_config (
        id,
        type,
        title,
        subtitle,
        text,
        imagelinkword
    )
    VALUES (
        ${id},
        ${type},
        ${title},
        ${subtitle},
        ${text},
        ${imageLinkWord}
    )
    RETURNING id
    `;
    return NextResponse.json({ id: rows[0].id }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && /unordered_pair/i.test(error.message)) {
      return NextResponse.json(
        { error: "This combination already exists" },
        { status: 409 },
      );
    }
    console.error("Combination create failed", error);
    return serverError();
  }
}
