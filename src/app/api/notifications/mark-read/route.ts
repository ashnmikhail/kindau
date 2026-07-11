import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    const { id } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    if (!id) {
      return NextResponse.json({ error: "Notification ID required" }, { status: 400 })
    }

    // FIX: match via User.clerkId
    await prisma.notification.updateMany({
      where: {
        id,
        user: {
          clerkId: userId,
        },
      },
      data: { read: true },
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error("Mark read error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
