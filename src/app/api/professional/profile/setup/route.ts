import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const {
      businessName,
      abn,
      phone,
      trades,
      serviceAreas,
      profileImage,
    } = body;

    const user = await prisma.user.findUnique({
      where: {
        clerkId,
      },
      include: {
        professional: true,
      },
    });

    if (!user || !user.professional) {
      return NextResponse.json(
        { error: "Professional not found" },
        { status: 404 }
      );
    }

    await prisma.professional.update({
      where: {
        id: user.professional.id,
      },
      data: {
        businessName,
        abn,
        phone,
        profileImage,
        onboardingCompleted: true,
        onboardingStep: 2,
      },
    });

    /*
      Replace all existing trades
    */

    await prisma.professionalCategory.deleteMany({
      where: {
        professionalId: user.professional.id,
      },
    });

    if (Array.isArray(trades)) {
      for (const categoryId of trades) {
        await prisma.professionalCategory.create({
          data: {
            professionalId: user.professional.id,
            categoryId,
          },
        });
      }
    }

    /*
      Replace all service areas
    */

    await prisma.serviceArea.deleteMany({
      where: {
        professionalId: user.professional.id,
      },
    });

    if (Array.isArray(serviceAreas)) {
      for (const area of serviceAreas) {
        await prisma.serviceArea.create({
          data: {
            professionalId: user.professional.id,
            suburb: area.suburb,
            postcode: area.postcode,
            state: area.state,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}