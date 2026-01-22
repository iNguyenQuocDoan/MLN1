"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { OwnedProperty, Player, Tile as TileT } from "@/lib/types";
import { useGame } from "@/context/GameContext";
import { useSession } from "@/context/SessionContext";
import { Tile } from "@/components/Tile";
import { Flashcard } from "@/components/Flashcard";
import { ControlPanel } from "@/components/ControlPanel";
import { StatsPanel } from "@/components/StatsPanel";
import { LogPanel } from "@/components/LogPanel";
import { QuestionModal } from "@/components/QuestionModal";
import { TileDetail } from "@/components/TileDetail";
import { WinnerModal } from "@/components/WinnerModal";
import { LuckyModal } from "@/components/LuckyModal";
import { MAX_TURNS, TARGET_LAPS } from "@/lib/gameData";
import { Crown, Trophy, Sparkles } from "lucide-react";

type Coord = { x: number; y: number };

function perimeterCoords5x5(): Coord[] {
  const coords: Coord[] = [];
  for (let x = 4; x >= 0; x--) coords.push({ x, y: 4 });
  for (let y = 3; y >= 0; y--) coords.push({ x: 0, y });
  for (let x = 1; x <= 4; x++) coords.push({ x, y: 0 });
  for (let y = 1; y <= 3; y++) coords.push({ x: 4, y });
  return coords;
}

function keyOf(c: Coord) {
  return `${c.x},${c.y}`;
}

// Center display component for the 9 empty cells
function BoardCenter({
  turn,
  targetLaps,
}: {
  turn: number;
  targetLaps: number;
}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-900/90 via-purple-900/90 to-indigo-900/90 p-3 text-white shadow-inner">
      {/* Game Logo */}
      <div className="float text-center">
        <div className="text-2xl font-black tracking-tight">
          <span className="bg-gradient-to-r from-red-400 via-amber-400 to-red-400 bg-clip-text text-transparent">
            MARX
          </span>
        </div>
        <div className="text-lg font-bold text-amber-300">-opoly</div>
      </div>

      {/* Mini Stats */}
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg bg-white/10 px-2 py-1.5 text-center backdrop-blur">
          <div className="text-lg font-black text-amber-300">{turn}</div>
          <div className="text-[10px] text-white/60">Lượt</div>
        </div>
        <div className="rounded-lg bg-white/10 px-2 py-1.5 text-center backdrop-blur">
          <div className="text-lg font-black text-emerald-300">
            {targetLaps}
          </div>
          <div className="text-[10px] text-white/60">Mục tiêu</div>
        </div>
      </div>

      {/* Decorative Element */}
      <div className="mt-2 flex items-center gap-1 text-amber-400/50">
        <Sparkles className="h-4 w-4" />
        <span className="text-[10px] font-semibold uppercase tracking-wider">
          Học trước chơi sau
        </span>
        <Sparkles className="h-4 w-4" />
      </div>
    </div>
  );
}

export function Board() {
  const { state, tiles, closeModal } = useGame();
  const { state: session } = useSession();
  const coords = useMemo(() => perimeterCoords5x5(), []);
  const [manualFocusIndex, setManualFocusIndex] = useState<number | null>(null);
  const focusIndex =
    manualFocusIndex ?? state.players[state.currentPlayerIndex].position;
  const [showWinnerModal, setShowWinnerModal] = useState(false);

  const tileByCoord = useMemo(() => {
    const map = new Map<string, TileT>();
    for (let i = 0; i < tiles.length; i++) {
      map.set(keyOf(coords[i]), tiles[i]);
    }
    return map;
  }, [coords, tiles]);

  const ownedByIndex = useMemo(() => {
    const map = new Map<number, OwnedProperty>();
    state.owned.forEach((o) => map.set(o.tileIndex, o));
    return map;
  }, [state.owned]);

  const playersAt = useMemo(() => {
    const map = new Map<number, Player[]>();
    state.players.forEach((p) => {
      const list = map.get(p.position) ?? [];
      list.push(p);
      map.set(p.position, list);
    });
    return map;
  }, [state.players]);

  const tokenCoords = useMemo(() => {
    return state.players.map((p, idx) => {
      // Lấy player ID number từ p.id
      const playerIdNumber = parseInt(p.id.split("_")[1] || "0", 10);
      const s = session.players[playerIdNumber] ?? session.players[0];
      return {
        id: p.id,
        name: s?.name || p.token.name,
        avatar: s?.avatar ?? null,
        colorHex: s?.color ?? null,
        colorClass: p.token.colorClass,
        pos: p.position,
        coord: coords[p.position],
      };
    });
  }, [state.players, coords, session.players]);

  const flashTile =
    state.activeModal.kind === "tileFlashcard"
      ? tiles[state.activeModal.tileIndex]
      : null;
  const flashOwned =
    flashTile && state.activeModal.kind === "tileFlashcard"
      ? (ownedByIndex.get(state.activeModal.tileIndex) ?? null)
      : null;

  const activeQuestion =
    state.activeModal.kind === "question" ? state.activeModal.question : null;
  const activeLuckyEffect =
    state.activeModal.kind === "lucky" ? state.activeModal.effect : null;
  const reachedTarget = state.players.some((p) => p.laps >= TARGET_LAPS);
  const isGameOver =
    (state.turn >= MAX_TURNS &&
      state.currentPlayerIndex === 0 &&
      !state.dice) ||
    reachedTarget;

  const ranking = useMemo(() => {
    return [...state.players]
      .map((p, idx) => {
        // Lấy player ID number từ p.id
        const playerIdNumber = parseInt(p.id.split("_")[1] || "0", 10);
        const s = session.players[playerIdNumber] ?? session.players[0];
        return {
          id: p.id,
          name: s?.name || p.name,
          avatar: s?.avatar ?? null,
          color: s?.color ?? null,
          laps: p.laps,
          pos: p.position,
          correct: p.correct,
          wrong: p.wrong,
        };
      })
      .sort((a, b) => {
        if (b.laps !== a.laps) return b.laps - a.laps;
        return b.pos - a.pos;
      });
  }, [state.players, session.players]);

  const leader = ranking[0] ?? null;
  const liveTop = ranking.slice(0, 4);

  // Delay hiển thị WinnerModal để người chơi nhìn thấy animation
  useEffect(() => {
    if (isGameOver && !showWinnerModal) {
      // Delay 2 giây để người chơi thấy xúc xắc và di chuyển
      const timer = setTimeout(() => {
        setShowWinnerModal(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
    // Reset showWinnerModal khi game không còn over (đã reset)
    if (!isGameOver && showWinnerModal) {
      setShowWinnerModal(false);
    }
  }, [isGameOver, showWinnerModal]);

  //
  // Check if a cell is in the center (not on perimeter)
  const isCenterCell = (x: number, y: number) => {
    return x >= 1 && x <= 3 && y >= 1 && y <= 3;
  };

  return (
    <div className="mx-auto w-full max-w-7xl p-4 pb-6 sm:p-6">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-white">
            <span className="text-3xl">🎲</span>
            <span className="bg-gradient-to-r from-red-400 via-amber-300 to-red-400 bg-clip-text text-transparent">
              Marx-opoly
            </span>
          </h1>
          <p className="mt-1 text-sm text-slate-200/90">
            Fast mode: {MAX_TURNS} lượt • Đua tới {TARGET_LAPS} vòng • Nhóm đi
            được nhiều vòng nhất chiến thắng.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-white/10 px-4 py-2 text-center backdrop-blur">
            <div className="text-xs text-slate-300">Lượt</div>
            <div className="text-xl font-black text-white">
              {state.turn}
              <span className="text-sm text-slate-400">/{MAX_TURNS}</span>
            </div>
          </div>
          {isGameOver && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-500/20 px-4 py-2 text-emerald-100 ring-1 ring-emerald-500/30">
              <Trophy className="h-5 w-5" />
              <span className="text-sm font-semibold">Kết thúc!</span>
            </div>
          )}
        </div>
      </div>

      {/* Live Ranking Bar */}
      <div className="mb-4 rounded-2xl border border-white/10 bg-gradient-to-r from-indigo-900/50 via-purple-900/50 to-indigo-900/50 p-4 shadow-xl backdrop-blur">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-300" />
            <span className="text-sm font-bold text-white">
              Xếp hạng trực tiếp
            </span>
          </div>
          <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white animate-pulse">
            LIVE
          </span>
        </div>

        {leader && (
          <div className="mt-3 rounded-xl border border-amber-400/30 bg-gradient-to-r from-amber-500/20 to-orange-500/20 p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-amber-400 text-lg font-bold shadow-lg active-player-glow"
                    style={{
                      backgroundColor: leader.color ?? "#fbbf24",
                      color: "#0f172a",
                    }}
                  >
                    {leader.avatar ?? leader.name.slice(0, 1)}
                  </span>
                  <span className="absolute -right-1 -top-1 rounded-full bg-amber-400 p-1 shadow-lg">
                    <Crown className="h-3 w-3 text-slate-900" />
                  </span>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wide text-amber-300">
                    Dẫn đầu
                  </div>
                  <div className="text-lg font-black text-white">
                    {leader.name}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-amber-300">
                  {leader.laps}
                </div>
                <div className="text-xs text-slate-300">vòng</div>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-700"
                style={{
                  width: `${Math.min(100, (leader.laps / TARGET_LAPS) * 100)}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Other Players */}
        <div className="mt-3 flex flex-wrap gap-2">
          {liveTop.slice(1).map((r, idx) => (
            <div
              key={r.id}
              className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5"
            >
              <span className="text-xs font-bold text-slate-400">
                #{idx + 2}
              </span>
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold"
                style={{
                  backgroundColor: r.color ?? "#64748b",
                  color: "#0f172a",
                }}
              >
                {r.avatar ?? r.name.slice(0, 1)}
              </span>
              <span className="text-xs font-semibold text-white">{r.name}</span>
              <span className="text-xs text-amber-300">{r.laps}v</span>
            </div>
          ))}
        </div>
      </div>

      {/* Game Over Results */}
      {isGameOver && (
        <div className="mb-4 overflow-hidden rounded-2xl border border-amber-400/30 bg-gradient-to-br from-amber-500/10 via-emerald-500/10 to-indigo-500/10 p-5 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-amber-400 p-2">
              <Trophy className="h-6 w-6 text-slate-900" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">
                KẾT QUẢ CUỐI CÙNG
              </h2>
              <p className="text-sm text-slate-300">
                Xếp hạng theo số vòng hoàn thành
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {ranking.map((r, idx) => (
              <div
                key={r.id}
                className={[
                  "relative overflow-hidden rounded-xl p-4 transition-all",
                  idx === 0
                    ? "bg-gradient-to-br from-amber-500/30 to-orange-500/30 ring-2 ring-amber-400/50"
                    : idx === 1
                      ? "bg-gradient-to-br from-slate-400/20 to-slate-500/20 ring-1 ring-slate-400/30"
                      : idx === 2
                        ? "bg-gradient-to-br from-orange-600/20 to-amber-600/20 ring-1 ring-orange-400/30"
                        : "bg-white/5",
                ].join(" ")}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={[
                      "flex h-10 w-10 items-center justify-center rounded-full font-bold",
                      idx === 0
                        ? "bg-amber-400 text-slate-900"
                        : "bg-white/20 text-white",
                    ].join(" ")}
                  >
                    {idx === 0
                      ? "🥇"
                      : idx === 1
                        ? "🥈"
                        : idx === 2
                          ? "🥉"
                          : `#${idx + 1}`}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate font-bold text-white">
                      {r.name}
                    </div>
                    <div className="text-sm text-slate-300">
                      {r.laps} vòng • Ô {r.pos}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Game Area */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
        {/* Board */}
        <div className="relative min-h-[70vh] rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-slate-100 via-white to-indigo-50 p-3 shadow-2xl">
          {/* Radial glow effect */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.1)_0%,transparent_70%)]" />

          <div
            className="relative grid gap-1 rounded-2xl p-1"
            style={{
              gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
              gridTemplateRows: "repeat(5, minmax(0, 1fr))",
            }}
          >
            {Array.from({ length: 25 }).map((_, i) => {
              const x = i % 5;
              const y = Math.floor(i / 5);
              const t = tileByCoord.get(keyOf({ x, y })) ?? null;
              const isActive = t
                ? state.players[state.currentPlayerIndex].position === t.index
                : false;
              const isFocused = t ? focusIndex === t.index : false;
              const isCenter = isCenterCell(x, y);

              // For center cells, show BoardCenter only in the middle (2,2)
              if (isCenter) {
                if (x === 2 && y === 2) {
                  return (
                    <div
                      key={i}
                      className="col-span-3 row-span-3 p-1"
                      style={{ gridColumn: "2 / 5", gridRow: "2 / 5" }}
                    >
                      <BoardCenter turn={state.turn} targetLaps={TARGET_LAPS} />
                    </div>
                  );
                }
                return null; // Skip other center cells
              }

              return (
                <div key={i} className="aspect-square p-0.5">
                  {t ? (
                    <Tile
                      tile={t}
                      owned={ownedByIndex.get(t.index) ?? null}
                      playersHere={playersAt.get(t.index) ?? []}
                      isActive={isActive}
                      isFocused={isFocused}
                      onHover={() => setManualFocusIndex(t.index)}
                      onClick={() => setManualFocusIndex(t.index)}
                    />
                  ) : (
                    <div className="h-full w-full rounded-lg border border-dashed border-slate-200 bg-slate-50/50" />
                  )}
                </div>
              );
            })}

            {/* Token overlay */}
            <div className="pointer-events-none absolute inset-0">
              {tokenCoords.map((t) => {
                const left = `${(t.coord.x + 0.5) * 20}%`;
                const top = `${(t.coord.y + 0.5) * 20}%`;
                const isActive =
                  t.id === state.players[state.currentPlayerIndex].id;
                const stacked = playersAt.get(t.pos) ?? [];
                const idx = stacked.findIndex((p) => p.id === t.id);
                const spread =
                  stacked.length > 1
                    ? (idx - (stacked.length - 1) / 2) * 18
                    : 0;

                return (
                  <div
                    key={t.id}
                    className={[
                      "absolute transition-all duration-500 ease-in-out",
                      isActive ? "z-20" : "z-10",
                    ].join(" ")}
                    style={{
                      left,
                      top,
                      transform: `translate(-50%, -50%) translateX(${spread}px)`,
                    }}
                  >
                    <div
                      className={[
                        "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-extrabold shadow-lg transition-all duration-300",
                        isActive
                          ? "border-amber-400 ring-4 ring-amber-400/40 scale-110 active-player-glow"
                          : "border-white/80",
                      ].join(" ")}
                      title={t.name}
                      style={{
                        backgroundColor: t.colorHex ?? "#8b5cf6",
                        color: "#1e293b",
                        boxShadow: isActive
                          ? `0 4px 20px ${t.colorHex || "#8b5cf6"}80`
                          : `0 2px 10px rgba(0,0,0,0.2)`,
                      }}
                    >
                      {t.avatar ?? t.name.slice(0, 1)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-3 lg:sticky lg:top-4">
          <ControlPanel />
          <TileDetail
            tile={tiles[focusIndex] ?? null}
            owned={ownedByIndex.get(focusIndex) ?? null}
            owner={
              ownedByIndex.get(focusIndex)
                ? (state.players.find(
                    (p) => p.id === ownedByIndex.get(focusIndex)!.ownerId,
                  ) ?? null)
                : null
            }
          />
          <StatsPanel
            players={state.players}
            owned={state.owned}
            tiles={tiles}
          />
          <LogPanel logs={state.logs} />
        </div>
      </div>

      {/* Modals */}
      {flashTile && (
        <Flashcard tile={flashTile} owned={flashOwned} onClose={closeModal} />
      )}
      {activeQuestion && <QuestionModal question={activeQuestion} />}
      {activeLuckyEffect && <LuckyModal effect={activeLuckyEffect} />}
      {showWinnerModal && <WinnerModal ranking={ranking} />}
    </div>
  );
}
