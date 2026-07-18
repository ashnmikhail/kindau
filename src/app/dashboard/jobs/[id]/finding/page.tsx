import { prisma } from "@/lib/prisma";
import FindingClient from "./FindingClient";

type FindingPageProps = {
  params: Promise<{ id: string }>;
};

export default async function FindingPage({ params }: FindingPageProps) {
  const { id } = await params; 

  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      subcategory: {
        include: { category: true },
      },
    },
  });

  if (!job) return <div>Job not found</div>;

  return <FindingClient job={job} />;
}