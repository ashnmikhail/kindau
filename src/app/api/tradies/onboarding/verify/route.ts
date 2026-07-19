import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { uploadToStorage } from "@/lib/upload"; // your upload helper

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.redirect("/sign-in");

  const form = await req.formData();

  const licenseFile = form.get("license") as File;
  const insuranceFile = form.get("insurance") as File;
  const idFile = form.get("id") as File;

  // Upload files to storage (S3, Supabase, Cloudflare, etc.)
  const licenseUrl = await uploadToStorage(licenseFile, `license-${clerkId}`);
  const insuranceUrl = await uploadToStorage(insuranceFile, `insurance-${clerkId}`);
  const idUrl = await uploadToStorage(idFile, `id-${clerkId}`);

  await prisma.professional.update({
    where: { userId: clerkId },
    data: {
      onboardingStep: 8,
      // store URLs in your model (add fields if needed)
      bio: `License: ${licenseUrl}, Insurance: ${insuranceUrl}, ID: ${idUrl}`,
    },
  });

  return NextResponse.redirect("/tradies/onboarding/complete");
}
