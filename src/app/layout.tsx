export const dynamic = "force-dynamic";

import "../components/styles/globals.css";
import AppShell from "@/components/AppShell";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata = {
  title: "KindAu",
  description:
    "Australia's fair platform connecting customers with skilled professionals",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
        <ClerkProvider>
          <AppShell>{children}</AppShell>
        </ClerkProvider>
      </body>
    </html>
  );
}