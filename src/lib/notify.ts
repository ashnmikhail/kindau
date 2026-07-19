import { prisma } from "@/lib/prisma";

// In-app notification
async function notifyInApp(
  userId: string,
  title: string,
  body?: string
) {
  // Combine title and body into a single message string for the database contract
  const combinedMessage = body ? `${title}: ${body}` : title;

  await prisma.notification.create({
    data: {
      userId,
      message: combinedMessage,
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
  type?: string; // Kept to support caller configurations smoothly
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

  // Email preferences (Mapped directly to verified schema keys)
  if (template === "newOffer" && !prefs.emailOffers) allowEmail = false;
  if (template === "offerAccepted" && !prefs.emailOffers) allowEmail = false;
  if (template === "jobStarted" && !prefs.emailJobUpdates) allowEmail = false;
  if (template === "jobCompleted" && !prefs.emailJobUpdates) allowEmail = false;
  if (template === "newMessage" && !prefs.emailJobUpdates) allowEmail = false; // Fallback to job updates

  // In-app preferences (Mapped directly to verified schema keys)
  if (template === "newOffer" && !prefs.inAppOffers) allowInApp = false;
  if (template === "jobStarted" && !prefs.inAppJobUpdates) allowInApp = false;
  if (template === "jobCompleted" && !prefs.inAppJobUpdates) allowInApp = false;
  if (template === "newMessage" && !prefs.inAppJobUpdates) allowInApp = false; // Fallback to job updates

  // In-app notification
  if (allowInApp) {
    await notifyInApp(userId, title, body);
  }

  // Email notification
  if (allowEmail && email) {
    await notifyEmail(email, title, body ?? "");
  }
}