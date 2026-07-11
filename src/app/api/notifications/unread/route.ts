import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ count: 0 })
    }

    // FIX: match via User.clerkId
    const count = await prisma.notification.count({
      where: {
        user: {
          clerkId: userId,
        },
        read: false,
      },
    })

    return NextResponse.json({ count })
  } catch (err: any) {
    console.error("Unread notifications error:", err)
    return NextResponse.json({ count: 0 })
  }
}
