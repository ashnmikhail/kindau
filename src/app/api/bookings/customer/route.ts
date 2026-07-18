import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export async function GET() {
  const { userId } = await auth()
  if (!userId) return Response.json([], { status: 401 })

  const bookings = await prisma.booking.findMany({
    where: {
      customerId: userId,
      status: "PENDING_CUSTOMER",
    },
    include: {
      job: {
        include: {
          subcategory: {
            include: { category: true },
          },
        },
      },
      professional: true,
    },
  })

  return Response.json(bookings)
}
