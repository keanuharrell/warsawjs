import { NextResponse } from "next/server";
import { ChatMessageDB } from "@warsawjs/core";

// POST /api/demo/chat - Save chat message
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = await ChatMessageDB.create(body);
    return NextResponse.json(message);
  } catch (error) {
    console.error("[API] Failed to save message:", error);
    return NextResponse.json(
      { error: "Failed to save message" },
      { status: 500 }
    );
  }
}
