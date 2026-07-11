interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TradieJobPage({ params }: PageProps) {
  // Await the params to resolve them correctly for Next.js 15
  const { id } = await params;

  return <div>Tradie Job: {id}</div>;
}