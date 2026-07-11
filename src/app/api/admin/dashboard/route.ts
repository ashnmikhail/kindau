"use server"

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const professionals = await prisma.professional.findMany({
    include: {
      categories: true,
      serviceAreas: true,
    },
  })

  const jobs = await prisma.job.findMany({
    include: {
      // FIX: jobOffers → offers
      offers: true,

      // FIX: jobAssignments → assignments
      assignments: true,
    },
  })

  return NextResponse.json({ professionals, jobs })
}
