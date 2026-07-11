"use client";

import type { ReactNode } from "react";
import ClientProviders from "@/components/ClientProviders";
import Navbar from "@/components/Navbar";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <ClientProviders>
      <Navbar />
      {children}
    </ClientProviders>
  );
}
