import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET() {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({
      totalJobs: 0,
      totalEarnings: 0,
    })
  }

  // FIX: get professional.id instead of using clerk userId
  const professional = await prisma.professional.findFirst({
    where: {
      user: {
        clerkId: userId,
      },
    },
    select: { id: true },
  })

  if (!professional) {
    return NextResponse.json({
      totalJobs: 0,
      totalEarnings: 0,
    })
  }

  const completedJobs = await prisma.job.findMany({
    where: {
      // FIX: correct relation name
      assignments: {
        some: {
          professionalId: professional.id,
        },
      },
      status: "COMPLETED",
    },
    select: {
      price: true,
    },
  })

  const totalJobs = completedJobs.length

  const totalEarnings = completedJobs.reduce(
    (sum, job) => sum + Number(job.price ?? 0),
    0
  )

  return NextResponse.json({
    totalJobs,
    totalEarnings,
  })
}
