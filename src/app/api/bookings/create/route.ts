import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { hasConflict } from "@/lib/conflicts";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { jobId, scheduledAt } = await req.json();

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: { professional: true },
  });

  if (!job) return Response.json({ error: "Job not found" }, { status: 404 });

  // Ensure professional owns this job
  if (!job.professional || job.professional.userId !== userId)
    return Response.json({ error: "Forbidden" }, { status: 403 });

  // Ensure job is ready for booking proposal
  if (job.status !== "CONTACT_PENDING")
    return Response.json(
      { error: "Job is not ready for booking proposal" },
      { status: 400 }
    );

  // Prevent scheduling conflicts
  const conflict = await hasConflict(
    job.professionalId!,
    job.requestedDay!,
    job.startTime!,
    job.endTime!
  );

  if (conflict)
    return Response.json(
      { error: "Professional has a scheduling conflict" },
      { status: 409 }
    );

  // Create booking (pending customer confirmation)
  const booking = await prisma.booking.create({
    data: {
      scheduledDate: new Date(scheduledAt),
      status: "PENDING_CUSTOMER",
      job: { connect: { id: jobId } },
      customer: { connect: { id: job.userId } },
      professional: { connect: { id: job.professional.id } },
    },
  });

  return Response.json({ success: true, booking });
}
