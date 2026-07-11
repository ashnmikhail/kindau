"use server";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  context: { params: Promise<{ conversationId: string }> }
) {
  try {
    const { conversationId } = await context.params;

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      include: { sender: true },
    });

    return NextResponse.json({ messages });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Unable to load messages" },
      { status: 500 }
    );
  }
}
