import { Professional } from "@prisma/client";

export function applyRotation(
  professionals: Professional[]
): Professional[] {
  return professionals.sort((a, b) => {
    return a.createdAt.getTime() - b.createdAt.getTime();
  });
}