"use client";

import Link from "next/link";
import { useUser, SignOutButton } from "@clerk/nextjs";

export default function Navbar() {
  const { user } = useUser();

  return (
    <nav className="w-full border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

        <Link
          href="/"
          className="text-2xl font-bold text-slate-900"
        >
          KindAu
        </Link>

        <div className="flex items-center gap-4">

          <Link
            href="/subscribe"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium"
          >
            Join as a Skilled Professional
          </Link>

          <Link
            href="/customers/book"
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
          >
            Book a Job
          </Link>

          {!user ? (
            <Link
              href="/sign-in"
              className="text-sm font-medium text-gray-700"
            >
              Sign In
            </Link>
          ) : (
            <SignOutButton>
              <button className="text-sm font-medium text-gray-700">
                Sign Out
              </button>
            </SignOutButton>
          )}

        </div>
      </div>
    </nav>
  );
}