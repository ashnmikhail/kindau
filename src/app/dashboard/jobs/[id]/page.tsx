import { prisma } from "@/lib/prisma";
import AssignedClient from "./AssignedClient";

type JobPageProps = {
  params: Record<string, string>;
};

export default async function JobPage({ params }: JobPageProps) {
  const job = await prisma.job.findUnique({
    where: { id: params.id },
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
