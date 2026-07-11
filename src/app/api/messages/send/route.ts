import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { conversationId, senderId, body } = await req.json()

  // FIX: resolve actual DB user
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: senderId },
    select: { id: true },
  })

  if (!dbUser) {
    return NextResponse.json({ error: "Invalid sender" }, { status: 400 })
  }

  const message = await prisma.message.create({
    data: {
      conversationId,
      senderId: dbUser.id, // FIXED
      body,
    },
  })

  return NextResponse.json(message)
}
