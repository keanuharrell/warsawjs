import { NextResponse } from "next/server";
import { DemoStateDB, ChatMessageDB, VoteDB } from "@warsawjs/core";

// POST /api/demo/reset - Reset everything
export async function POST() {
  try {
    await Promise.all([
      DemoStateDB.reset(),
      ChatMessageDB.clear(),
      VoteDB.clear(),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] Failed to reset:", error);
    return NextResponse.json(
      { error: "Failed to reset" },
      { status: 500 }
    );
  }
}
