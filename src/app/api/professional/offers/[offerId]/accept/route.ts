"use server";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(
  req: Request,
  context: { params: Promise<{ offerId: string }> }
) {
  try {
    const { offerId } = await context.params;
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const offer = await prisma.jobOffer.update({
      where: { id: offerId },
      data: { status: "ACCEPTED" },
      include: {
        job: true,
      },
    });

    return NextResponse.json({ offer });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Unable to accept offer" },
      { status: 500 }
    );
  }
}
