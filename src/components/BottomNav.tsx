"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home", icon: "🏠" },
    { href: "/jobs", label: "Jobs", icon: "🛠️" },
    { href: "/messages", label: "Messages", icon: "💬" },
    { href: "/profile", label: "Profile", icon: "👤" },
  ];

  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0
        bg-white border-t
        flex justify-around items-center
        py-1.5
        md:hidden
        z-50
        pb-[env(safe-area-inset-bottom)]
      "
    >
      {navItems.map((item) => {
        const active = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className="
              flex flex-col items-center justify-center
              text-[10px] font-medium
            "
          >
            <span
              className={`
                text-lg leading-none
                ${active ? "text-kindau-teal" : "text-gray-400"}
              `}
            >
              {item.icon}
            </span>
            <span
              className={`
                mt-0.5
                ${active ? "text-kindau-teal" : "text-gray-400"}
              `}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
