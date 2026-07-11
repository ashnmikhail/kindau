import Stripe from "stripe"

let stripeInstance: Stripe | null = null

export function getStripe() {
  if (stripeInstance) return stripeInstance

  const key = process.env.STRIPE_SECRET_KEY

  console.log("Stripe key exists:", !!key)

  if (!key) {
    console.error("STRIPE_SECRET_KEY is missing")
    return null
  }

  stripeInstance = new Stripe(key)

  return stripeInstance
}