import { prisma } from "@/lib/prisma";
import FindingClient from "./FindingClient";
import type { PageProps } from "next";

export default async function FindingPage({ params }: PageProps) {
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
