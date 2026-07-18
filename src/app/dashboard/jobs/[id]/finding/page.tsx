import { prisma } from "@/lib/prisma";
import FindingClient from "./FindingClient";

type FindingPageProps = {
  params: { id: string } | Promise<{ id: string }>;
};

export default async function FindingPage({ params }: FindingPageProps) {
  const resolved = await params; // handles both object and Promise

  const job = await prisma.job.findUnique({
    where: { id: resolved.id },
    include: {
      subcategory: {
        include: { category: true },
      },
    },
  });

  if (!job) return <div>Job not found</div>;

  return <FindingClient job={job} />;
}
