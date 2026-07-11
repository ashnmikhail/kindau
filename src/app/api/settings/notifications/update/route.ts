import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const data = await req.json()

  // FIX: match via User.clerkId
  const prefs = await prisma.notificationPreferences.updateMany({
    where: {
      user: {
        clerkId: userId,
      },
    },
    data,
  })

  return NextResponse.json(prefs)
}
