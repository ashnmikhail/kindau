import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const jobs = await prisma.job.findMany({
    include: {
      subcategory: true,

      // FIX: jobOffers → offers
      offers: true,

      // FIX: jobAssignments → assignments
      assignments: true,

      bookings: true,
    },
  })

  return NextResponse.json(jobs)
}
