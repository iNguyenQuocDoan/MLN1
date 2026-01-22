"use client";

import React, { useMemo } from "react";
import type { OwnedProperty, Player, Tile } from "@/lib/types";
import { useSession } from "@/context/SessionContext";
import { TARGET_LAPS } from "@/lib/gameData";
import { Trophy } from "lucide-react";

export function StatsPanel(props: {
  players: Player[];
  owned: OwnedProperty[];
  tiles: Tile[];
}) {
  const { players } = props;
  const { state: session } = useSession();

  const rows = useMemo(() => {
    return [...players]
      .map((p, idx) => {
        // Lấy player ID number từ p.id (ví dụ: PLAYER_0 -> 0)
        const playerIdNumber = parseInt(p.id.split("_")[1] || "0", 10);
        const s = session.players[playerIdNumber] ?? session.players[0];
        return {
          id: p.id,
          name: s?.name || p.name,
          avatar: s?.avatar ?? null,
          color: s?.color ?? undefined,
          laps: p.laps,
          pos: p.position,
          skip: p.skipTurns,
          correct: p.correct,
          wrong: p.wrong,
          colorClass: p.token.colorClass,
        };
      })
      .sort((a, b) => {
        if (b.laps !== a.laps) return b.laps - a.laps;
        return b.pos - a.pos;
      });
  }, [players, session.players]);

  const rankBadges = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣", "6️⃣"];

  return (
    <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          <h3 className="text-sm font-bold text-slate-800">Bảng xếp hạng</h3>
        </div>
        <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-600">
          LIVE
        </span>
      </div>

      {/* Player Cards */}
      <div className="mt-3 space-y-2">
        {rows.map((r, idx) => (
          <div
            key={r.id}
            className={[
              "group relative overflow-hidden rounded-xl border p-3 transition-all duration-300",
              idx === 0
                ? "border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50 shadow-md shadow-amber-200/50"
                : "border-slate-100 bg-white hover:border-indigo-200 hover:shadow-sm",
            ].join(" ")}
          >
            {/* Rank Badge */}
            <div className="absolute -left-1 -top-1 text-xl">
              {rankBadges[idx] || `#${idx + 1}`}
            </div>

            <div className="flex items-center justify-between gap-3 pl-6">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="relative">
                  <span
                    className={[
                      "flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold shadow-md transition-transform group-hover:scale-105",
                      idx === 0
                        ? "ring-2 ring-amber-400"
                        : "ring-2 ring-slate-200",
                    ].join(" ")}
                    style={{
                      backgroundColor: r.color ?? "#e2e8f0",
                      color: r.color ? "#1e293b" : "#64748b",
                    }}
                  >
                    {r.avatar ?? r.name.slice(0, 1)}
                  </span>
                  {idx === 0 && (
                    <span className="absolute -right-1 -top-1 text-xs">👑</span>
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0">
                  <div className="truncate text-sm font-bold text-slate-800">
                    {r.name}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500">
                    <span>Ô {r.pos}</span>
                    <span>•</span>
                    <span className="text-emerald-600">✓{r.correct ?? 0}</span>
                    <span className="text-red-500">✗{r.wrong ?? 0}</span>
                    {r.skip > 0 && (
                      <>
                        <span>•</span>
                        <span className="text-amber-600">⏸{r.skip}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Laps */}
              <div className="text-right">
                <div
                  className={[
                    "text-xl font-black",
                    idx === 0 ? "text-amber-600" : "text-indigo-600",
                  ].join(" ")}
                >
                  {r.laps}
                </div>
                <div className="text-[10px] text-slate-400">vòng</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-2 pl-6">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={[
                    "h-full rounded-full transition-all duration-700",
                    idx === 0
                      ? "bg-gradient-to-r from-amber-400 to-yellow-500"
                      : "bg-gradient-to-r from-indigo-400 to-purple-500",
                  ].join(" ")}
                  style={{
                    width: `${Math.min(100, (r.laps / TARGET_LAPS) * 100)}%`,
                  }}
                />
              </div>
              <div className="mt-0.5 text-[9px] text-slate-400">
                {r.laps}/{TARGET_LAPS} vòng
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
