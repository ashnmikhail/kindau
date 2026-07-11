"use client";
export const dynamic = "force-dynamic";

import { SignIn, useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    console.log("USER:", user);
    console.log("ROLE:", user.publicMetadata.role);

    const role = user.publicMetadata.role;

    if (role === "tradie") {
      router.push("/dashboard/tradie");
    } else if (role === "customer") {
      router.push("/dashboard/customer");
    } else {
      router.push("/join");
    }
  }, [user, router]);

  return (
    <div className="flex justify-center py-20">
      <SignIn routing="path" path="/sign-in" />
    </div>
  );
}