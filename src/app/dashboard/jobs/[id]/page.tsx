import { prisma } from "@/lib/prisma";
import AssignedClient from "./AssignedClient";

type JobPageProps = {
  params: { id: string } | Promise<{ id: string }>;
};

export default async function JobPage({ params }: JobPageProps) {
  const resolved = await params;

  const job = await prisma.job.findUnique({
    where: { id: resolved.id },
    include: {
      assignments: {
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
