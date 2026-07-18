await notify(
  professional.userId,
  professional.email,
  "New Job Offer",
  `You have a new offer for job ${job.id}`,
  "newOffer",
  `/dashboard/offers`
)
