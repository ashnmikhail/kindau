"use server";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(
  req: Request,
  { params }: { params: { conversationId: string } }
) {
  try {
    const { conversationId } = params;
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { body } = await req.json();

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: userId,
        body,
      },
    });

    return NextResponse.json({ message });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Unable to send message" },
      { status: 500 }
    );
  }
}
