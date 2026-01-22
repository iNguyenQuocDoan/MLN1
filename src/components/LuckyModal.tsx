"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, Dice1, ArrowUp, ArrowDown, Clover } from "lucide-react";
import { useGame } from "@/context/GameContext";
import type { LuckyEffect } from "@/lib/types";

const LUCKY_SOUND = "https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3";

function getEffectInfo(effect: LuckyEffect) {
  switch (effect.kind) {
    case "rollAgain":
      return {
        icon: <Dice1 className="h-12 w-12" />,
        title: "Gieo xúc xắc lần nữa!",
        description: "Bạn được gieo thêm 1 lần xúc xắc trong lượt này!",
        color: "from-amber-500 to-yellow-500",
        emoji: "🎲",
      };
    case "moveForward":
      return {
        icon: <ArrowUp className="h-12 w-12" />,
        title: `Tiến ${effect.steps} bước!`,
        description: `Bạn được di chuyển thêm ${effect.steps} bước về phía trước!`,
        color: "from-emerald-500 to-green-500",
        emoji: "⬆️",
      };
    case "moveBackward":
      return {
        icon: <ArrowDown className="h-12 w-12" />,
        title: `Lùi ${effect.steps} bước!`,
        description: `Bạn phải lùi lại ${effect.steps} bước!`,
        color: "from-red-500 to-rose-500",
        emoji: "⬇️",
      };
  }
}

export function LuckyModal({ effect }: { effect: LuckyEffect }) {
  const { applyLuckyEffect } = useGame();
  const [animateIn, setAnimateIn] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);

  const info = getEffectInfo(effect);

  useEffect(() => {
    // Play lucky sound
    const audio = new Audio(LUCKY_SOUND);
    audio.volume = 0.7;
    audio.play().catch(() => {
      // Silently fail if autoplay restricted
    });

    // Trigger entrance animation
    setTimeout(() => setAnimateIn(true), 100);
    // Stop confetti after a while
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const confettiEmojis = ["🍀", "⭐", "✨", "🌟", "💫", "🎊", "🎉"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      {/* Confetti */}
      {showConfetti && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${0.5 + Math.random() * 1}s`,
              }}
            >
              {confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)]}
            </div>
          ))}
        </div>
      )}

      <div
        className={[
          "relative w-full max-w-md overflow-hidden rounded-3xl shadow-2xl transition-all duration-500",
          "bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900",
          "border border-white/20",
          animateIn ? "scale-100 opacity-100" : "scale-90 opacity-0",
        ].join(" ")}
      >
        {/* Decorative top bar */}
        <div className={`h-2 w-full bg-gradient-to-r ${info.color}`} />

        {/* Header */}
        <div className="relative p-6 text-center">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.2),transparent_60%)]" />

          <div className="relative">
            {/* Lucky Icon */}
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-green-500 shadow-xl shadow-emerald-500/50 animate-pulse">
              <Clover className="h-12 w-12 text-white" />
            </div>

            <div className="flex items-center justify-center gap-2">
              <Sparkles className="h-6 w-6 text-amber-400" />
              <h2 className="text-2xl font-black uppercase tracking-wide text-white">
                Ô May Mắn!
              </h2>
              <Sparkles className="h-6 w-6 text-amber-400" />
            </div>
          </div>
        </div>

        {/* Effect Display */}
        <div className="mx-6 mb-6 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className={`rounded-full bg-gradient-to-br ${info.color} p-4 text-white shadow-lg`}>
              {info.icon}
            </div>
            <div>
              <div className="text-4xl mb-2">{info.emoji}</div>
              <h3 className="text-xl font-bold text-white">{info.title}</h3>
              <p className="mt-2 text-sm text-white/70">{info.description}</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="border-t border-white/10 bg-white/5 p-4">
          <button
            onClick={applyLuckyEffect}
            className={[
              "w-full rounded-xl px-6 py-3 text-lg font-bold transition-all",
              `bg-gradient-to-r ${info.color} text-white`,
              "hover:shadow-lg hover:scale-[1.02]",
              "active:scale-[0.98]",
            ].join(" ")}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}
