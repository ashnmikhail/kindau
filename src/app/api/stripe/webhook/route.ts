import { NextResponse } from "next/server"
import Stripe from "stripe"
import { getStripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

export async function POST(req: Request) {
  const stripe = getStripe()
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 500 }
    )
  }

  const sig = req.headers.get("stripe-signature")
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!sig || !webhookSecret) {
    return NextResponse.json(
      { error: "Missing Stripe webhook configuration" },
      { status: 400 }
    )
  }

  const rawBody = await req.text()

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session

        const professionalId = session.metadata?.professionalId
        const customerId = session.customer as string | null
        const subscriptionId = session.subscription as string | null

        if (!professionalId || !customerId || !subscriptionId) break

        await prisma.professional.update({
          where: { id: professionalId },
          data: {
            stripeCustomerId: customerId,
            subscriptionId,
            subscriptionStatus: "active",
          },
        })

        break
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription & {
          current_period_end?: number
        }

        const customerId = subscription.customer as string
        const status = subscription.status

        const currentPeriodEnd = subscription.current_period_end
          ? new Date(subscription.current_period_end * 1000)
          : null

        await prisma.professional.updateMany({
          where: { stripeCustomerId: customerId },
          data: {
            subscriptionId: subscription.id,
            subscriptionStatus: status,
            subscriptionCurrentPeriodEnd: currentPeriodEnd,
          },
        })

        break
      }

      default:
        break
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error("Error handling Stripe webhook:", err)
    return NextResponse.json({ error: "Webhook handler error" }, { status: 500 })
  }
}
