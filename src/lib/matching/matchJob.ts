import { prisma } from "@/lib/prisma";

export async function matchJob(jobId: string) {
  const job = await prisma.job.findUnique({
    where: {
      id: jobId,
    },
    include: {
      subcategory: {
        include: {
          category: true,
        },
      },
    },
  });

  if (!job) {
    throw new Error("Job not found");
  }

  console.log("Matching Job:", job.id);

  return true;
}