import { prisma } from "@/lib/prisma";
import FindingClient from "./FindingClient";

export default async function FindingPage({ params }) {
  const job = await prisma.job.findUnique({
    where: { id: params.id },
    include: {
      subcategory: {
        include: { category: true },
      },
    },
  });

  if (!job) return <div>Job not found</div>;

  return <FindingClient job={job} />;
}
