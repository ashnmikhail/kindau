	import { NextResponse } from "next/server"
	import { auth } from "@clerk/nextjs/server"
	import { prisma } from "@/lib/prisma"

	export async function GET() {
	  try {
		const { userId } = await auth()

		if (!userId) {
		  return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
		}

		// FIX: match Professional via User.clerkId
		const tradie = await prisma.professional.findFirst({
		  where: {
			user: {
			  clerkId: userId,
			},
		  },
		})

		if (!tradie) {
		  return NextResponse.json({ error: "Tradie not found" }, { status: 404 })
		}

		const offers = await prisma.jobOffer.findMany({
		  where: {
			professionalId: tradie.id,
			status: "PENDING",
		  },
		  include: {
			job: {
			  include: {
				subcategory: true,
			  },
			},
		  },
		  orderBy: { createdAt: "asc" },
		})

		return NextResponse.json(offers)
	  } catch (err: any) {
		return NextResponse.json({ error: err.message }, { status: 500 })
	  }
	}
