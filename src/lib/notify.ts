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
 * Email notification (with footer link)
 */
export async function emailUser(email: string, subject: string, body: string) {
  if (!email) return

  const resend = getResend()
  if (!resend) return

  const footer = `
    <hr style="margin:24px 0; border:none; border-top:1px solid #e5e5e5;" />
    <p style="font-size:13px; color:#777;">
      You are receiving this email based on your Kindau notification settings.<br/>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/settings/notifications" 
         style="color:#0f766e; text-decoration:underline;">
        Manage notification preferences
      </a>
    </p>
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
 * Combined notification with user preferences
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
  if (template === "newOffer" && !prefs.emailOffers) allowEmail = false
  if (template === "offerAccepted" && !prefs.emailOffers) allowEmail = false
  if (template === "jobStarted" && !prefs.emailJobUpdates) allowEmail = false
  if (template === "jobCompleted" && !prefs.emailJobUpdates) allowEmail = false

  let allowInApp = true
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
