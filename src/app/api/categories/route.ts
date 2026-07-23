import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      subcategories: {
        orderBy: {
          name: "asc",
        },
      },
    },
  });

  return NextResponse.json(categories);
}