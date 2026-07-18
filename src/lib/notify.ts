import { prisma } from "@/lib/prisma"
import { Resend } from "resend"

/**
 * Safe Resend instance creator
 */
function getResend() {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    console.warn("RESEND_API_KEY missing — skipping email send")
    return null
  }
  return new Resend(key)
}

/**
 * In‑app notification
 */
export async function notifyUser(userId: string, message: string) {
  return prisma.notification.create({
    data: {
      userId,
      message,
    },
  })
}

/**
 * Email notification
 */
export async function emailUser(email: string, subject: string, body: string) {
  if (!email) return

  const resend = getResend()
  if (!resend) return

  const footer = `
    <hr />
    <p>You are receiving this email based on your Kindau notification settings.</p>
  `

  try {
    await resend.emails.send({
      from: "Kindau <no-reply@kindau.com>",
      to: email,
      subject,
      html: `<div><p>${body}</p>${footer}</div>`,
    })
  } catch (err) {
    console.error("Email send failed:", err)
  }
}

/**
 * ⭐ Step 2 — Preference‑aware notification wrapper
 * THIS GOES HERE
 */
export async function notify(
  userId: string,
  email: string | null,
  subject: string,
  message: string,
  template: string
) {
  const prefs = await prisma.notificationPreferences.findUnique({
    where: { userId },
  })

  if (!prefs) {
    await notifyUser(userId, message)
    if (email) await emailUser(email, subject, message)
    return
  }

  if (prefs.doNotDisturb) return

  let allowEmail = true
  let allowInApp = true

  if (template === "newOffer" && !prefs.emailOffers) allowEmail = false
  if (template === "offerAccepted" && !prefs.emailOffers) allowEmail = false
  if (template === "jobStarted" && !prefs.emailJobUpdates) allowEmail = false
  if (template === "jobCompleted" && !prefs.emailJobUpdates) allowEmail = false

  if (template === "newOffer" && !prefs.inAppOffers) allowInApp = false
  if (template === "jobStarted" && !prefs.inAppJobUpdates) allowInApp = false
  if (template === "jobCompleted" && !prefs.inAppJobUpdates) allowInApp = false

  if (allowInApp) {
    await notifyUser(userId, message)
  }

  if (allowEmail && email) {
    await emailUser(email, subject, message)
  }
}
