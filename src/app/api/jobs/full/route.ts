import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      assignment: {
        include: { professional: true },
      },
      subcategory: {
        include: { category: true },
      },
    },
  });

  return NextResponse.json(job);
}
