"use client";

import React, { useMemo } from "react";
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

function initials(name: string) {
  const s = name.trim();
  if (!s) return "?";
  const parts = s.split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("");
}

function contrastText(color: string) {
  const match = /^#?([0-9a-fA-F]{6})$/.exec(color.trim());
  if (!match) return "#0f172a";
  const hex = match[1];
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.65 ? "#0f172a" : "#f8fafc";
}

function withAlpha(color: string, alphaHex: string) {
  const match = /^#([0-9a-fA-F]{6})$/.exec(color.trim());
  if (!match) return color;
  return `#${match[1]}${alphaHex}`;
}

export function TopBar() {
  const pathname = usePathname();
  const { state, setActivePlayer } = useSession();

  const active = useMemo(
    () => state.players.find((p) => p.id === state.activePlayerId) ?? state.players[0],
    [state.players, state.activePlayerId]
  );

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

        <div className="flex items-center gap-2">
          <div className="hidden text-xs text-slate-200 md:block">
            Người đang chơi: <span className="font-semibold text-white">{active.name}</span>
          </div>
          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
            {state.players.map((p) => (
              <button
                key={p.id}
                onClick={() => setActivePlayer(p.id)}
                className={[
                  "flex items-center gap-2 rounded-full px-2 py-1 text-xs font-semibold transition",
                  p.id === state.activePlayerId ? "text-white" : "text-slate-200 hover:bg-white/10",
                ].join(" ")}
                title={`${p.name} • ${p.score} điểm`}
                style={{
                  backgroundColor:
                    p.id === state.activePlayerId ? withAlpha(p.color, "33") : withAlpha(p.color, "12"),
                  borderColor: withAlpha(p.color, "55"),
                }}
              >
                <span
                  className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px]"
                  style={{ backgroundColor: p.color, color: contrastText(p.color) }}
                >
                  {p.avatar || initials(p.name)}
                </span>
                <span className="hidden md:inline">{p.score}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

