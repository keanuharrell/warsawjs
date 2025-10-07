import { NextResponse } from "next/server";
import { DemoStateDB, ChatMessageDB, VoteDB } from "@warsawjs/core";

// GET /api/demo/state - Get current state
export async function GET() {
  try {
    const state = await DemoStateDB.get();
    const messages = await ChatMessageDB.list(100);
    const votes = await VoteDB.count();

    return NextResponse.json({
      state: state || {
        id: "current",
        mode: "waiting",
        chatEnabled: false,
        voteEnabled: false,
        updatedAt: Date.now(),
        createdAt: Date.now(),
      },
      messages,
      votes,
    });
  } catch (error) {
    console.error("[API] Failed to get state:", error);
    return NextResponse.json(
      { error: "Failed to get state" },
      { status: 500 }
    );
  }
}

// POST /api/demo/state - Update state
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const state = await DemoStateDB.update(body);
    return NextResponse.json(state);
  } catch (error) {
    console.error("[API] Failed to update state:", error);
    return NextResponse.json(
      { error: "Failed to update state" },
      { status: 500 }
    );
  }
}
