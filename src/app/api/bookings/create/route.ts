import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { notify } from "@/lib/notify"
import { logActivity } from "@/lib/activity"
import { JobStatus, BookingStatus } from "@prisma/client"

export async function POST(req: Request) {
  try {
    const { jobId, professionalId, scheduledDate } = await req.json()

    if (!jobId || !professionalId) {
      return NextResponse.json({ error: "Missing jobId or professionalId" }, { status: 400 })
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        user: true,          // customer
        assignments: true,
      },
    })

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    const professional = await prisma.professional.findUnique({
      where: { id: professionalId },
      include: { user: true },
    })

    if (!professional) {
      return NextResponse.json({ error: "Professional not found" }, { status: 404 })
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        jobId,
        customerId: job.userId,
        professionalId,
        scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
        status: BookingStatus.CONFIRMED,
      },
    })

    // Update job status
    await prisma.job.update({
      where: { id: jobId },
      data: { status: JobStatus.BOOKED },
    })

    // Log activity
    await logActivity(jobId, "BOOKING_CONFIRMED", "Booking confirmed", job.userId)

    // Notify customer
    await notify(
      job.user.id,
      job.user.email,
      "Booking Confirmed",
      "Your booking has been confirmed",
      "bookingConfirmed",
      `/dashboard/bookings/${booking.id}`
    )

    // Notify professional
    await notify(
      professional.user.id,
      professional.user.email,
      "New Booking",
      "You have a new confirmed booking",
      "bookingConfirmed",
      `/dashboard/bookings/${booking.id}`
    )

    return NextResponse.json({ ok: true, booking })
  } catch (err) {
    console.error("Booking creation error:", err)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}
