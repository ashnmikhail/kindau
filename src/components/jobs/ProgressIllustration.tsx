interface Props {
  currentIndex: number
}

const steps = [
  {
    emoji: "📝",
    title: "Created",
  },
  {
    emoji: "🔎",
    title: "Matching",
  },
  {
    emoji: "📩",
    title: "Offer Sent",
  },
  {
    emoji: "🤝",
    title: "Accepted",
  },
  {
    emoji: "📅",
    title: "Booked",
  },
  {
    emoji: "🛠️",
    title: "Working",
  },
  {
    emoji: "🎉",
    title: "Complete",
  },
]

export default function ProgressIllustration({
  currentIndex,
}: Props) {
  return (
    <div className="overflow-x-auto">
      <div className="flex items-center min-w-max py-6">

        {steps.map((step, index) => (
          <div
            key={step.title}
            className="flex items-center"
          >
            <div className="flex flex-col items-center">

              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow

                ${
                  index < currentIndex
                    ? "bg-kindau-teal text-white"
                    : index === currentIndex
                    ? "bg-kindau-orange text-white animate-pulse"
                    : "bg-gray-200"
                }`}
              >
                {step.emoji}
              </div>

              <p
                className={`mt-2 text-sm font-medium ${
                  index === currentIndex
                    ? "text-kindau-orange"
                    : ""
                }`}
              >
                {step.title}
              </p>
            </div>

            {index !== steps.length - 1 && (
              <div
                className={`w-20 h-1 mx-2 rounded ${
                  index < currentIndex
                    ? "bg-kindau-teal"
                    : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}