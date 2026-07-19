import { prisma } from "@/lib/prisma";

// In-app notification
async function notifyInApp(
  userId: string,
  title: string,
  body?: string
) {
  await prisma.notification.create({
    data: {
      userId,
      title,
      body: body ?? null,
    },
  });
}

// Email notification (placeholder)
async function notifyEmail(
  email: string,
  subject: string,
  body: string
) {
  console.log(`Email to ${email}: ${subject} — ${body}`);
}

// Main notification function
export async function notify({
  userId,
  email,
  title,
  body,
  template,
}: {
  userId: string;
  email?: string | null;
  type?: string; // Kept as optional parameter to prevent breaking caller files
  title: string;
  body?: string;
  template: string;
}) {
  const prefs = await prisma.notificationPreferences.findUnique({
    where: { userId },
  });

  // If no preferences exist → allow everything
  if (!prefs) {
    await notifyInApp(userId, title, body);
    if (email) await notifyEmail(email, title, body ?? "");
    return;
  }

  // Do Not Disturb
  if (prefs.doNotDisturb) return;

  let allowEmail = true;
  let allowInApp = true;

  // Email preferences
  if (template === "newOffer" && !prefs.emailOffers) allowEmail = false;
  if (template === "offerAccepted" && !prefs.emailOffers) allowEmail = false;
  if (template === "jobStarted" && !prefs.emailJobUpdates) allowEmail = false;
  if (template === "jobCompleted" && !prefs.emailJobUpdates) allowEmail = false;
  if (template === "newMessage" && !prefs.emailMessages) allowEmail = false;

  // In-app preferences
  if (template === "newOffer" && !prefs.inAppOffers) allowInApp = false;
  if (template === "jobStarted" && !prefs.inAppJobUpdates) allowInApp = false;
  if (template === "jobCompleted" && !prefs.inAppJobUpdates) allowInApp = false;
  if (template === "newMessage" && !prefs.inAppMessages) allowInApp = false;

  // In-app notification
  if (allowInApp) {
    await notifyInApp(userId, title, body);
  }

  // Email notification
  if (allowEmail && email) {
    await notifyEmail(email, title, body ?? "");
  }
}