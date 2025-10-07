import { NextResponse } from "next/server";
import { VoteDB } from "@warsawjs/core";

// POST /api/demo/vote - Save vote
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const vote = await VoteDB.upsert(body);
    const counts = await VoteDB.count();
    return NextResponse.json({ vote, counts });
  } catch (error) {
    console.error("[API] Failed to save vote:", error);
    return NextResponse.json(
      { error: "Failed to save vote" },
      { status: 500 }
    );
  }
}
