import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json([], { status: 200 })
    }

    // FIX: match via User.clerkId
    const notifications = await prisma.notification.findMany({
      where: {
        user: {
          clerkId: userId,
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(notifications)
  } catch (error) {
    console.error(error)
    return NextResponse.json([], { status: 200 })
  }
}
