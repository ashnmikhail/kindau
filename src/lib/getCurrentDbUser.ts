import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getCurrentDbUser() {
  const { userId: clerkId } = await auth();

  if (!clerkId) return null;

  let user = await prisma.user.findUnique({
    where: {
      clerkId,
    },
  });

  if (!user) {
    const clerkUser = await currentUser();

    if (!clerkUser) return null;

    user = await prisma.user.create({
      data: {
        clerkId,
        email:
          clerkUser.emailAddresses?.[0]?.emailAddress ??
          `${clerkId}@placeholder.com`,
        name: clerkUser.fullName,
      },
    });
  }

  return user;
}