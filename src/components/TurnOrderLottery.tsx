"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, X } from "lucide-react";

type Player = {
  id: number;
  name: string;
  color: string;
  avatar: string;
};

type Props = {
  players: Player[];
  onComplete: (order: number[]) => void;
  onClose: () => void;
};

export function TurnOrderLottery({ players, onComplete, onClose }: Props) {
  const [spinning, setSpinning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [lotteryKey, setLotteryKey] = useState(0); // Thêm key để force re-render
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null); // Ref để lưu interval

  const startLottery = () => {
    // Play random sound
    const audio = new Audio("/sounds/random.mp3");
    audio.volume = 0.7;
    audio.play().catch(() => {
      // Silently fail if autoplay restricted
    });

    // Clear interval cũ nếu có
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Tăng key để đảm bảo state mới hoàn toàn
    setLotteryKey((prev) => prev + 1);
    setSpinning(true);
    setResults([]);
    setShowResults(false);
    setCurrentIndex(Math.floor(Math.random() * players.length)); // Random start position

    // Tạo thứ tự ngẫu nhiên - tạo mới hoàn toàn mỗi lần
    const shuffled: number[] = [];
    const available = [...players.map((_, i) => i)];

    // Random pick từng phần tử
    while (available.length > 0) {
      const randomIndex = Math.floor(Math.random() * available.length);
      shuffled.push(available[randomIndex]);
      available.splice(randomIndex, 1);
    }

    // Animation quay màu - cố định 3 giây
    const ANIMATION_DURATION = 3000; // 3 giây
    const INTERVAL_SPEED = 80; // Tốc độ chuyển màu (ms)
    const startTime = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setCurrentIndex((prev) => (prev + 1) % players.length);

      // Dừng sau đúng 3 giây
      if (elapsed >= ANIMATION_DURATION) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setTimeout(() => {
          setSpinning(false);
          setResults(shuffled);
          setShowResults(true);
        }, 300);
      }
    }, INTERVAL_SPEED);
  };

  // Cleanup khi unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleConfirm = () => {
    if (results.length > 0) {
      onComplete(results);
    }
  };

  useEffect(() => {
    // Auto start khi mở modal
    setTimeout(() => startLottery(), 300);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-amber-400/30 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 shadow-2xl">
        {/* Header */}
        <div className="relative border-b border-white/10 p-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.2),transparent_60%)]" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 shadow-lg">
                <Sparkles className="h-6 w-6 text-slate-900" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">Xổ Số Thứ Tự</h2>
                <p className="text-sm text-amber-300">
                  May mắn sẽ quyết định ai đi trước!
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-xl bg-white/10 p-2 text-white transition-all hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Spinning Wheel */}
        {!showResults && (
          <div className="p-8">
            <div className="mb-6 text-center">
              <div className="text-sm font-semibold text-white/80">
                {spinning ? "🎰 Đang quay..." : "🎲 Chuẩn bị..."}
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              {players.map((player, idx) => (
                <div
                  key={player.id}
                  className={[
                    "flex h-20 w-20 flex-col items-center justify-center rounded-2xl border-2 text-2xl transition-all duration-300",
                    spinning && currentIndex === idx
                      ? "scale-125 border-white shadow-2xl ring-4 ring-white/50"
                      : "scale-100 border-white/20 opacity-60",
                  ].join(" ")}
                  style={{
                    backgroundColor: player.color,
                    boxShadow:
                      spinning && currentIndex === idx
                        ? `0 0 30px ${player.color}`
                        : "none",
                  }}
                >
                  {player.avatar}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {showResults && (
          <div className="p-6">
            <div className="mb-4 text-center">
              <div className="text-lg font-bold text-emerald-300">
                🎉 Kết quả xổ số!
              </div>
            </div>

            <div className="space-y-3">
              {results.map((playerId, position) => {
                const player = players[playerId];
                return (
                  <div
                    key={position}
                    className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 fade-in"
                    style={{
                      animationDelay: `${position * 0.1}s`,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/30 text-2xl shadow-lg"
                        style={{ backgroundColor: player.color }}
                      >
                        {player.avatar}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">
                          {player.name}
                        </div>
                        <div className="text-xs text-slate-400">
                          Nhóm {player.id + 1}
                        </div>
                      </div>
                    </div>

                    <div className="ml-auto">
                      <div
                        className={[
                          "rounded-full px-4 py-2 text-center font-black shadow-lg",
                          position === 0
                            ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900"
                            : position === 1
                              ? "bg-gradient-to-r from-slate-300 to-slate-400 text-slate-900"
                              : position === 2
                                ? "bg-gradient-to-r from-orange-400 to-amber-500 text-slate-900"
                                : "bg-white/20 text-white",
                        ].join(" ")}
                      >
                        {position === 0
                          ? "🥇"
                          : position === 1
                            ? "🥈"
                            : position === 2
                              ? "🥉"
                              : ""}{" "}
                        Lượt {position + 1}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={startLottery}
                className="flex-1 rounded-xl border border-white/20 bg-white/10 px-6 py-3 font-semibold text-white transition-all hover:bg-white/20"
              >
                🔄 Quay lại
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-6 py-3 font-bold text-slate-900 shadow-lg transition-all hover:from-amber-500 hover:to-yellow-600 hover:shadow-xl"
              >
                ✅ Xác nhận
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
