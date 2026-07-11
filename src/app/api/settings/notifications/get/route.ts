import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // FIX: match via User.clerkId
  const prefs = await prisma.notificationPreferences.findFirst({
    where: {
      user: {
        clerkId: userId,
      },
    },
  })

  return NextResponse.json(prefs)
}
