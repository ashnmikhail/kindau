"use client";
export const dynamic = "force-dynamic";

import { SignUp, useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    const role = user.publicMetadata.role;

    if (role === "tradie") {
      router.push("/tradies");
    } else if (role === "customer") {
      router.push("/customers/dashboard");
    } else {
      router.push("/subscribe");
    }
  }, [user, router]);

  return (
    <div className="flex justify-center py-20">
      <SignUp routing="path" path="/sign-up" />
    </div>
  );
}
