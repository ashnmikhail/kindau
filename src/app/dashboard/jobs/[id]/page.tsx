import { prisma } from "@/lib/prisma";
import AssignedClient from "./AssignedClient";

export default async function JobPage({ params }) {
  const job = await prisma.job.findUnique({
    where: { id: params.id },
    include: {
      assignment: {
        include: {
          professional: true,
        },
      },
      subcategory: {
        include: { category: true },
      },
    },
  });

  if (!job) return <div>Job not found</div>;

  return <AssignedClient job={job} />;
}
