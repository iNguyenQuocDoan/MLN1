"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/context/SessionContext";

const nav = [
  { href: "/", label: "Home" },
  { href: "/team", label: "Đăng ký nhóm" },
  { href: "/theory", label: "Lý thuyết" },
  { href: "/presentation", label: "Thuyết trình" },
  { href: "/quiz", label: "Trắc nghiệm" },
  { href: "/scenario", label: "Tình huống" },
  { href: "/game", label: "Marx-opoly" },
];

export function TopBar() {
  const pathname = usePathname();
  useSession();

  if (pathname?.startsWith("/game")) return null;

  return (
    <div className="border-b border-white/10 bg-slate-950/80">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 py-3">
        <div className="flex flex-wrap items-center gap-2">
          {nav.map((n) => {
            const isActive = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={[
                  "rounded-full px-3 py-1 text-sm font-semibold transition",
                  isActive ? "bg-white/15 text-white" : "text-slate-200 hover:bg-white/10",
                ].join(" ")}
              >
                {n.label}
              </Link>
            );
          })}
        </div>

        {/* Right side (active player + quick switcher) intentionally hidden for cleaner UI */}
      </div>
    </div>
  );
}

