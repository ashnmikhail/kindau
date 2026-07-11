import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: jobId } = await params;

  const job = await prisma.job.findUnique({
    where: {
      id: jobId,
    },
    include: {
      user: true,

      conversation: true,

      subcategory: {
        include: {
          category: true,
        },
      },

      offers: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          professional: true,
        },
      },

      assignments: {
        include: {
          professional: true,
        },
      },
    },
  });

  if (!job || job.deletedAt) {
    return NextResponse.json(
      { error: "Not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    id: job.id,

    category: job.subcategory.category.name,
    service: job.subcategory.name,

    description: job.description,

    suburb: job.suburb,
    postcode: job.postcode,

    price: job.price,

    status: job.status,

    createdAt: job.createdAt,

    customerId: job.userId,
    customerName: job.user?.name ?? null,
    customerEmail: job.user?.email ?? null,

    conversationId: job.conversation?.id ?? null,

    offerCount: job.offers.length,

    assignedProfessional:
      job.assignments[0]?.professional?.businessName ??
      job.assignments[0]?.professional?.name ??
      null,
  });
}