import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

        {/* LOGO */}
        <Link href="/" className="flex items-center">
          <Image
            src="/kindau-logo.png"
            alt="KindAu - Fair Marketplace"
            width={260}
            height={70}
            priority
            className="h-auto w-auto max-h-16"
          />
        </Link>

        {/* NAVIGATION */}
        <nav className="flex items-center gap-4">

          <Link
            href="/join"
            className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium transition hover:bg-gray-50"
          >
            Join as a Professional
          </Link>

          <Link
            href="/book"
            className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            Book a Job
          </Link>

        </nav>

      </div>
    </header>
  );
}