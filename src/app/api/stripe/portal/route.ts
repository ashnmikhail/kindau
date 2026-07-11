import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { getStripe } from "@/lib/stripe"

export async function POST() {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 })
  }

  // FIX: match Professional via User.clerkId
  const professional = await prisma.professional.findFirst({
    where: {
      user: {
        clerkId: userId,
      },
    },
  })

  if (!professional) {
    return NextResponse.json({ error: "Not a tradie" }, { status: 400 })
  }

  const stripe = getStripe()
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 500 }
    )
  }

  if (!professional.stripeCustomerId) {
    return NextResponse.json(
      { error: "No Stripe customer found for this user" },
      { status: 400 }
    )
  }

  const portal = await stripe.billingPortal.sessions.create({
    customer: professional.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/tradies/subscription`,
  })

  return NextResponse.json({ url: portal.url })
}
