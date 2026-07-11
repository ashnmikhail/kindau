import { prisma } from "@/lib/prisma";

// TEMP: Replace with real auth later
export async function requireAdmin() {
  const userId = "TEMP_USER_ID";

  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  return user;
}
