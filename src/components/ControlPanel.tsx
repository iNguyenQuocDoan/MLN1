"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Dices, LogOut, RotateCcw, Sparkles, HelpCircle } from "lucide-react";
import { MAX_TURNS, TARGET_LAPS } from "@/lib/gameData";
import { useGame } from "@/context/GameContext";
import { useSession } from "@/context/SessionContext";

// Enhanced 3D Dice Component
function DiceFace3D({ value, rolling }: { value: number; rolling: boolean }) {
  const dots = (r: number, c: number) => {
    const patterns: Record<number, Array<[number, number]>> = {
      1: [[2, 2]],
      2: [[1, 1], [3, 3]],
      3: [[1, 1], [2, 2], [3, 3]],
      4: [[1, 1], [1, 3], [3, 1], [3, 3]],
      5: [[1, 1], [1, 3], [2, 2], [3, 1], [3, 3]],
      6: [[1, 1], [2, 1], [3, 1], [1, 3], [2, 3], [3, 3]],
    };
    return (patterns[value] ?? []).some(([rr, cc]) => rr === r && cc === c);
  };

  return (
    <div
      className={[
        "relative h-14 w-14 rounded-xl p-1.5 transition-all duration-300",
        "bg-gradient-to-br from-white via-slate-50 to-slate-100",
        "border-2 border-slate-200",
        "shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_4px_8px_rgba(0,0,0,0.15)]",
        rolling ? "dice-roll-bounce" : "",
      ].join(" ")}
      style={{
        transform: rolling ? undefined : "perspective(200px) rotateX(5deg)",
      }}
    >
      <div className="grid h-full w-full grid-cols-3 grid-rows-3 gap-0.5">
        {Array.from({ length: 9 }).map((_, i) => {
          const r = Math.floor(i / 3) + 1;
          const c = (i % 3) + 1;
          const isOn = dots(r, c);
          return (
            <div key={i} className="flex items-center justify-center">
              <span
                className={[
                  "h-2.5 w-2.5 rounded-full transition-all duration-200",
                  isOn
                    ? "bg-gradient-to-br from-red-500 to-red-700 shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
                    : "bg-transparent",
                ].join(" ")}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ControlPanel() {
  const { state, tiles, rollDice, openQuestion, endTurn, clearMessage, reset } = useGame();
  const { state: session } = useSession();
  const current = state.players[state.currentPlayerIndex];
  const tile = tiles[current.position];
  const sessionPlayer = session.players[state.currentPlayerIndex] ?? session.players[0];
  const displayName = current.isHuman ? sessionPlayer.name || current.name : current.name;

  const [isRolling, setIsRolling] = useState(false);
  const [preview, setPreview] = useState<{ a: number; b: number } | null>(null);
  const timerRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

  const reachedTarget = state.players.some((p) => p.laps >= TARGET_LAPS);
  const isOver = (state.turn >= MAX_TURNS && state.currentPlayerIndex === 0) || reachedTarget;
  const hasActed = state.hasActedThisTurn && current.isHuman;
  const isQuestionOpen = state.activeModal.kind === "question";

  const onRollClick = useCallback(() => {
    if (isRolling) return;

    if (!state.diceAllowance) {
      openQuestion();
      return;
    }

    setIsRolling(true);
    setPreview({ a: 1 + Math.floor(Math.random() * 6), b: 1 + Math.floor(Math.random() * 6) });

    intervalRef.current = window.setInterval(() => {
      setPreview({ a: 1 + Math.floor(Math.random() * 6), b: 1 + Math.floor(Math.random() * 6) });
    }, 90);

    timerRef.current = window.setTimeout(() => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      intervalRef.current = null;
      rollDice();
      setIsRolling(false);
      setPreview(null);
    }, 800);
  }, [isRolling, openQuestion, rollDice, state.diceAllowance]);

  const shownA = isRolling ? preview?.a ?? 1 : state.dice?.a ?? 1;
  const shownB = isRolling ? preview?.b ?? 1 : state.dice?.b ?? 1;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!current.isHuman) return;
      if (isQuestionOpen) return;
      const key = e.key.toLowerCase();
      if (key === "r") {
        onRollClick();
      }
      if (key === "e") {
        endTurn();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current.isHuman, endTurn, isQuestionOpen, onRollClick]);

  return (
    <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-white via-slate-50 to-indigo-50 p-4 shadow-lg shadow-indigo-900/10">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎮</span>
            <span className="text-xs font-bold uppercase tracking-wide text-indigo-600">Lượt hiện tại</span>
          </div>
          <div className="mt-2 flex items-center gap-3">
            {current.isHuman && (
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-sm font-bold shadow-lg transition-transform hover:scale-105"
                style={{
                  backgroundColor: sessionPlayer.color || "#8b5cf6",
                  color: "#1e293b",
                  boxShadow: `0 4px 12px ${sessionPlayer.color || "#8b5cf6"}40`,
                }}
              >
                {sessionPlayer.avatar || displayName.slice(0, 1)}
              </span>
            )}
            <div>
              <div className="truncate text-lg font-bold text-slate-800">{displayName}</div>
              <div className="text-xs text-slate-500">
                Ô: <span className="font-semibold text-indigo-600">{tile.name}</span>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={reset}
          className="group inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        >
          <RotateCcw className="h-4 w-4 transition-transform group-hover:rotate-180" />
          <span className="hidden sm:inline">Chơi lại</span>
        </button>
      </div>

      {/* Dice Section */}
      <div className="mt-4 rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 p-4 text-white">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            {state.dice ? (
              <div className="space-y-1">
                <div className="text-xs text-slate-400">Kết quả</div>
                <div className="flex items-center gap-2 text-2xl font-black">
                  <span className="text-amber-400">{state.dice.a}</span>
                  <span className="text-slate-500">+</span>
                  <span className="text-amber-400">{state.dice.b}</span>
                  <span className="text-slate-500">=</span>
                  <span className="rounded-lg bg-amber-500 px-2 py-0.5 text-slate-900">{state.dice.total}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="text-xs text-slate-400">Hướng dẫn</div>
                <div className="text-sm">
                  {state.diceAllowance ? (
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-emerald-400" />
                      <span>
                        Được gieo <span className="font-bold text-emerald-400">{state.diceAllowance}</span> xúc xắc!
                      </span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 text-amber-300">
                      <HelpCircle className="h-4 w-4" />
                      Trả lời câu hỏi để gieo xúc xắc
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <DiceFace3D value={shownA} rolling={isRolling} />
            {(state.diceAllowance === 2 || state.dice?.b) && (
              <DiceFace3D value={shownB} rolling={isRolling} />
            )}
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {/* Step 1: Answer Question */}
        <div
          className={[
            "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-all",
            state.diceAllowance
              ? "bg-emerald-100 text-emerald-700 ring-2 ring-emerald-500/30"
              : "bg-amber-100 text-amber-700 ring-2 ring-amber-500/30 animate-pulse",
          ].join(" ")}
        >
          <span className={state.diceAllowance ? "text-emerald-500" : "text-amber-500"}>
            {state.diceAllowance ? "✓" : "1"}
          </span>
          Trả lời
        </div>

        {/* Connector */}
        <div
          className={[
            "h-0.5 w-8 rounded-full transition-all duration-500",
            state.diceAllowance ? "bg-emerald-300" : "bg-slate-200",
          ].join(" ")}
        />

        {/* Step 2: Roll Dice */}
        <div
          className={[
            "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-all",
            state.dice
              ? "bg-emerald-100 text-emerald-700 ring-2 ring-emerald-500/30"
              : state.diceAllowance
                ? "bg-amber-100 text-amber-700 ring-2 ring-amber-500/30 animate-pulse"
                : "bg-slate-100 text-slate-400",
          ].join(" ")}
        >
          <span>{state.dice ? "✓" : "2"}</span>
          Gieo xúc xắc
        </div>
      </div>

      {/* Message */}
      {state.message && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 p-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2 text-sm text-amber-800">
              <span>⚠️</span>
              <span>{state.message}</span>
            </div>
            <button
              onClick={clearMessage}
              className="rounded-lg px-2 py-1 text-xs font-semibold text-amber-600 hover:bg-amber-100"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          onClick={onRollClick}
          disabled={
            !current.isHuman ||
            Boolean(state.awaitingDecision) ||
            isOver ||
            isRolling ||
            hasActed
          }
          className={[
            "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300",
            "bg-gradient-to-r from-red-500 via-red-600 to-orange-500",
            "hover:from-red-600 hover:via-red-700 hover:to-orange-600",
            "text-white shadow-lg shadow-red-500/30",
            "hover:shadow-xl hover:shadow-red-500/40 hover:scale-[1.02]",
            "active:scale-[0.98]",
            "disabled:from-slate-300 disabled:to-slate-400 disabled:shadow-none disabled:cursor-not-allowed",
          ].join(" ")}
        >
          <Dices className="h-5 w-5 transition-transform group-hover:rotate-12" />
          {isRolling ? "Đang gieo..." : state.diceAllowance ? "Gieo xúc xắc!" : "Trả lời để gieo"}
          {/* Shine effect */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        </button>

        <button
          onClick={endTurn}
          disabled={!current.isHuman || isOver}
          className={[
            "group inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300",
            "bg-gradient-to-r from-indigo-500 to-purple-600",
            "hover:from-indigo-600 hover:to-purple-700",
            "text-white shadow-lg shadow-indigo-500/30",
            "hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-[1.02]",
            "active:scale-[0.98]",
            "disabled:from-slate-300 disabled:to-slate-400 disabled:shadow-none disabled:cursor-not-allowed",
          ].join(" ")}
        >
          <LogOut className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          Kết thúc lượt
        </button>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="mt-3 flex justify-center gap-4 text-[10px] text-slate-400">
        <span className="flex items-center gap-1">
          <kbd className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-600">R</kbd>
          Gieo
        </span>
        <span className="flex items-center gap-1">
          <kbd className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-600">E</kbd>
          Kết thúc
        </span>
      </div>
    </div>
  );
}
