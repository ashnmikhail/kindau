import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("categoryId");

  if (!categoryId) {
    return NextResponse.json([], { status: 200 });
  }

  const subcategories = await prisma.subcategory.findMany({
    where: { categoryId },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(subcategories);
}
