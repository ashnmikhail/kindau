import { notify } from "@/lib/notify"

type NotifyEventParams = {
  userId: string
  email: string | null
  template:
    | "newOffer"
    | "offerAccepted"
    | "jobAssigned"
    | "jobStarted"
    | "jobCompleted"
    | "noTradies"
  jobTitle?: string
  link?: string
}

export async function notifyEvent({
  userId,
  email,
  template,
  jobTitle,
}: NotifyEventParams) {
  let subject = "Kindau Notification"
  let message = "You have a new notification."

  switch (template) {
    case "newOffer":
      subject = "New Job Offer"
      message = `You have received a new job offer for ${jobTitle}.`
      break

    case "offerAccepted":
      subject = "Job Offer Accepted"
      message = `Your offer for ${jobTitle} has been accepted.`
      break

    case "jobAssigned":
      subject = "Tradie Assigned"
      message = `A tradie has been assigned to your job: ${jobTitle}.`
      break

    case "jobStarted":
      subject = "Job Started"
      message = `Work has started on your job: ${jobTitle}.`
      break

    case "jobCompleted":
      subject = "Job Completed"
      message = `Your job has been completed: ${jobTitle}.`
      break

    case "noTradies":
      subject = "No Tradies Available"
      message = `We couldn't find an available tradie for ${jobTitle}.`
      break
  }

  await notify({
    userId,
    email,
    title: subject,
    body: message,
    type: template,
    template,
  })
}

export async function createInAppNotification(
  userId: string,
  message: string
) {
  return notify({
    userId,
    email: null,
    title: "Notification",
    body: message,
    type: "jobCompleted",
    template: "jobCompleted",
  })
}