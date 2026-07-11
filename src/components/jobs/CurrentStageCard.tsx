interface Props {
  status: string
}

const content: Record<
  string,
  {
    title: string
    description: string
    emoji: string
    color: string
  }
> = {
  PENDING: {
    emoji: "📝",
    title: "Job Submitted",
    description:
      "We've received your request and are preparing it for matching.",
    color: "bg-blue-50 border-blue-200",
  },

  MATCHING: {
    emoji: "🔎",
    title: "Finding Your Professional",
    description:
      "We're offering your job to the next available verified professional in your area.",
    color: "bg-yellow-50 border-yellow-200",
  },

  OFFERED: {
    emoji: "📩",
    title: "Offer Sent",
    description:
      "A local professional has received your job offer. They have a limited time to accept before it moves to the next professional.",
    color: "bg-orange-50 border-orange-200",
  },

  ASSIGNED: {
    emoji: "✅",
    title: "Professional Assigned",
    description:
      "Great news! A professional has accepted your job.",
    color: "bg-green-50 border-green-200",
  },

  CONTACT_PENDING: {
    emoji: "📞",
    title: "Awaiting Contact",
    description:
      "Your professional will contact you shortly to arrange a suitable time.",
    color: "bg-teal-50 border-teal-200",
  },

  BOOKED: {
    emoji: "📅",
    title: "Booking Confirmed",
    description:
      "Your appointment has been booked and confirmed.",
    color: "bg-cyan-50 border-cyan-200",
  },

  IN_PROGRESS: {
    emoji: "🛠️",
    title: "Work In Progress",
    description:
      "Your professional is currently completing your job.",
    color: "bg-purple-50 border-purple-200",
  },

  COMPLETED: {
    emoji: "🎉",
    title: "Job Complete",
    description:
      "Your work has been completed successfully.",
    color: "bg-green-100 border-green-300",
  },
}

export default function CurrentStageCard({ status }: Props) {
  const stage = content[status]

  if (!stage) return null

  return (
    <div className={`rounded-xl border p-6 ${stage.color}`}>
      <div className="flex items-center gap-4">
        <div className="text-5xl">{stage.emoji}</div>

        <div>
          <h2 className="text-xl font-bold">
            {stage.title}
          </h2>

          <p className="text-gray-600 mt-1">
            {stage.description}
          </p>
        </div>
      </div>
    </div>
  )
}