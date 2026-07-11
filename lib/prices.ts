// lib/prices.ts
export const PRICE_BY_COUNTRY: Record<string, string> = {
  AU: process.env.STRIPE_PRICE_AU_ID ?? "",
  NZ: process.env.STRIPE_PRICE_NZ_ID ?? "",
}
