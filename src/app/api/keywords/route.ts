import { NextResponse } from "next/server";
import { removeSynonymFromKeyword } from "../../lib/server-functions/keyword-update";
import { deleteKeywordWithCascade } from "../../lib/server-functions/keyword-delete";
import { createKeywordWithSynonyms } from "../../lib/server-functions/keyword-create";

//  CREATE KEYWORD WITH SYNONYMS
export async function POST(request: Request) {
  try {
    const { keyword, synonyms } = await request.json();

    // Validation
    if (!keyword || !synonyms) {
      return NextResponse.json(
        {
          success: false,
          error: "Keyword and synonyms are required",
          received: { keyword, synonyms },
        },
        { status: 400 },
      );
    }

    // Ensure synonyms is an array
    const synonymsArray = Array.isArray(synonyms)
      ? synonyms
      : synonyms.split(",").map((s: string) => s.trim());

    if (synonymsArray.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "At least one synonym is required",
        },
        { status: 400 },
      );
    }

    const result = await createKeywordWithSynonyms(keyword, synonymsArray);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error.message,
      },
      { status: 500 },
    );
  }
}

// REMOVE SYNONYM FROM KEYWORD
export async function PUT(request: Request) {
  try {
    const { keyword, synonymToRemove } = await request.json();

    // Validation
    if (!keyword) {
      return NextResponse.json(
        {
          success: false,
          error: "Keyword is required",
        },
        { status: 400 },
      );
    }

    if (!synonymToRemove) {
      return NextResponse.json(
        {
          success: false,
          error: "synonymToRemove is required",
        },
        { status: 400 },
      );
    }

    const result = await removeSynonymFromKeyword(keyword, synonymToRemove);

    if (!result.success) {
      const statusCode = result.error.includes("not found") ? 404 : 400;
      return NextResponse.json({ error: result.error }, { status: statusCode });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error.message,
      },
      { status: 500 },
    );
  }
}

//  DELETE KEYWORD WITH CASCADE
export async function DELETE(request: Request) {
  try {
    const { keyword } = await request.json();

    // Validation
    if (!keyword) {
      return NextResponse.json(
        {
          success: false,
          error: "Keyword is required",
        },
        { status: 400 },
      );
    }

    const result = await deleteKeywordWithCascade(keyword);

    if (!result.success) {
      const statusCode = result.error.includes("not found") ? 404 : 400;
      return NextResponse.json({ error: result.error }, { status: statusCode });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
