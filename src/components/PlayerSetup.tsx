"use client";

import React, { useState } from "react";
import {
  PLAYER_AVATARS,
  PLAYER_COLORS,
  useSession,
} from "@/context/SessionContext";
import { TurnOrderLottery } from "./TurnOrderLottery";

const avatarChoices = Array.from(
  new Set([...PLAYER_AVATARS, "🚀", "🎯", "🌿", "🛰️", "🐙"]),
);

function initials(name: string) {
  const s = name.trim();
  if (!s) return "?";
  const parts = s.split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("");
}

export function PlayerSetup() {
  const {
    state,
    setPlayerCount,
    setPlayerName,
    setPlayerColor,
    setPlayerAvatar,
    resetScores,
    resetAll,
    shuffleTurnOrder,
  } = useSession();

  const [showLottery, setShowLottery] = useState(false);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-slate-900/30">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-blue-100 ring-1 ring-white/15">
            Đăng ký nhóm
          </div>
          <h2 className="text-xl font-semibold text-white">
            Chọn màu • Đặt tên • Pick avatar
          </h2>
          <p className="text-sm text-slate-200/90">
            Cá nhân hóa {state.playerCount} nhóm để chấm điểm, đổi lượt và hiển
            thị avatar trên thanh top bar.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowLottery(true)}
            className="rounded-xl border border-amber-200/20 bg-amber-500/10 px-3 py-2 text-sm font-semibold text-amber-100 hover:bg-amber-500/15 transition-all hover:scale-105"
          >
            🎰 Xổ số thứ tự
          </button>
          <button
            onClick={resetScores}
            className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            Reset điểm
          </button>
          <button
            onClick={resetAll}
            className="rounded-xl border border-red-200/20 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-100 hover:bg-red-500/15"
          >
            Reset tất cả
          </button>
        </div>
      </div>

      {/* Player Count Selector */}
      <div className="mt-4 rounded-xl border border-white/10 bg-slate-950/40 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-white">
              Số lượng người chơi
            </h3>
            <p className="text-xs text-slate-300">Chọn từ 1 đến 6 người chơi</p>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6].map((count) => (
              <button
                key={count}
                onClick={() => setPlayerCount(count)}
                className={[
                  "h-10 w-10 rounded-lg border font-semibold transition",
                  state.playerCount === count
                    ? "border-white/60 bg-white/20 text-white ring-2 ring-white/40"
                    : "border-white/20 bg-white/5 text-slate-300 hover:bg-white/10",
                ].join(" ")}
                aria-label={`${count} người chơi`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {state.players.map((p) => {
          // Tìm thứ tự của player này trong turnOrder
          const turnPosition = state.turnOrder
            ? state.turnOrder.indexOf(p.id) + 1
            : null;

          return (
            <div
              key={p.id}
              className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 ring-1 ring-white/5 transition hover:border-white/20 hover:ring-white/10"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-lg font-semibold shadow-inner"
                    style={{ backgroundColor: p.color }}
                    aria-label={`Avatar nhóm ${p.id + 1}`}
                  >
                    {p.avatar || initials(p.name)}
                  </span>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-slate-300">
                      Nhóm {p.id + 1}
                    </div>
                    <input
                      value={p.name}
                      onChange={(e) => setPlayerName(p.id, e.target.value)}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white placeholder:text-slate-400 outline-none focus:border-white/25"
                      placeholder={`Tên nhóm ${p.id + 1}`}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {turnPosition && (
                    <div className="rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 px-3 py-1 text-xs font-black text-slate-900 shadow-lg">
                      Lượt {turnPosition}
                    </div>
                  )}
                  <div className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white">
                    Điểm: {p.score}
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>Chọn màu nhận diện</span>
                  <span className="text-slate-400">
                    Hiện trên badge & avatar
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {PLAYER_COLORS.map((c, idx) => {
                    const selected = p.color === c;
                    return (
                      <button
                        key={c}
                        onClick={() => setPlayerColor(p.id, c)}
                        className={[
                          "h-9 w-9 rounded-full border transition focus:outline-none focus:ring-2 focus:ring-white/60",
                          selected
                            ? "ring-2 ring-white/80 border-white/70"
                            : "border-white/20",
                        ].join(" ")}
                        style={{ backgroundColor: c }}
                        aria-label={`Chọn màu ${idx + 1}`}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>Chọn avatar</span>
                  <span className="text-slate-400">Dễ nhìn khi đổi lượt</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {avatarChoices.map((a) => {
                    const selected = p.avatar === a;
                    return (
                      <button
                        key={a}
                        onClick={() => setPlayerAvatar(p.id, a)}
                        className={[
                          "flex h-10 min-w-[2.5rem] items-center justify-center rounded-xl border px-2 text-lg transition",
                          "bg-white/5 text-white hover:bg-white/10",
                          selected
                            ? "border-white/60 ring-2 ring-white/70"
                            : "border-white/15",
                        ].join(" ")}
                        aria-label={`Avatar ${a}`}
                      >
                        {a}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Turn Order Lottery Modal */}
      {showLottery && (
        <TurnOrderLottery
          players={state.players}
          onComplete={(order) => {
            // Cập nhật thứ tự vào state với kết quả từ lottery
            shuffleTurnOrder(order);
            // Đóng modal
            setShowLottery(false);
          }}
          onClose={() => setShowLottery(false)}
        />
      )}
    </div>
  );
}
