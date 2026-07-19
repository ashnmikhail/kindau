// src/app/api/professional/jobs/route.ts

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 1. Find professional
  const professional = await prisma.professional.findFirst({
    where: {
      user: {
        clerkId: userId,
      },
    },
  });

  if (!professional) {
    return NextResponse.json([]);
  }

  // 2. Fetch service areas
  const areas = await prisma.serviceArea.findMany({
    where: { professionalId: professional.id },
  });

  const postcodes = areas.map(a => a.postcode);

  // 3. Fetch jobs in tradie's service area
  const jobs = await prisma.job.findMany({
    where: {
      status: { in: ["PENDING", "OFFERED"] },
      professionalId: null, // not assigned yet
      postcode: { in: postcodes },
      offers: {
        none: {
          professionalId: professional.id,
          status: { in: ["DECLINED", "EXPIRED"] },
        },
      },
    },
    include: {
      subcategory: { include: { category: true } },
      user: true,
      offers: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ jobs });
}
