export async function notify(
  userId: string,
  email: string | null,
  subject: string,
  message: string,
  template: string,
  link?: string   // ⭐ added
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
