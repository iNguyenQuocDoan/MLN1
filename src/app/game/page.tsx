"use client";

import { useState } from "react";
import { GameProvider } from "@/context/GameContext";
import { Board } from "@/components/Board";
import { PlayerSetup } from "@/components/PlayerSetup";
import { Sparkles, UsersRound, Play } from "lucide-react";

export default function GamePage() {
  const [started, setStarted] = useState(false);

  const handleStart = async () => {
    setStarted(true);
    try {
      await document.documentElement.requestFullscreen();
    } catch {
      // ignore if blocked; user can press F11
    }
  };

  if (!started) {
    return (
      <div className="min-h-screen bg-linear-to-b from-slate-900 to-slate-800 text-white flex items-center justify-center">
        <div className="text-center space-y-8">
          <h1 className="text-5xl font-bold">Marx-opoly</h1>
          <p className="text-slate-300 text-lg">Game cờ tỷ phú phiên bản triết học</p>
          <button
            type="button"
            onClick={handleStart}
            className="group relative inline-flex items-center gap-3 rounded-full bg-linear-to-r from-blue-500 to-purple-600 px-8 py-4 text-xl font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40"
          >
            <Play className="h-6 w-6 fill-current" />
            Bắt đầu chơi
          </button>
          <p className="text-slate-400 text-sm">Nhấn để bật nhạc nền và vào game</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 to-slate-800 text-white">
      {/* Background music - hidden YouTube player */}
      <iframe
        className="hidden"
        width="0"
        height="0"
        src="https://www.youtube.com/embed/4w3VqzwJ1j4?si=C7kqQcyghEqyPioq&autoplay=1&loop=1&playlist=4w3VqzwJ1j4"
        title="Background music"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-blue-100 ring-1 ring-white/15">
              <UsersRound className="h-3.5 w-3.5" />
              Game • Đăng ký nhóm
            </div>
            <h1 className="text-3xl font-bold leading-tight">Marx-opoly + cấu hình nhóm</h1>
            <p className="text-sm text-slate-200/90">
              Đăng ký nhóm, chọn màu và avatar ngay tại tab Game; cấu hình này sẽ được dùng chung với thanh
              top bar và các mode khác.
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-slate-100">
              <span className="rounded-full bg-white/10 px-2 py-1">Nhóm 4 người</span>
              <span className="rounded-full bg-white/10 px-2 py-1">Màu & avatar đồng bộ</span>
              <span className="rounded-full bg-white/10 px-2 py-1">Lưu cục bộ</span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-slate-100">
            <div className="flex items-start gap-2">
              <div className="rounded-xl bg-white/10 p-2 text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-semibold uppercase tracking-wide text-blue-100">Mẹo</div>
                <ul className="space-y-1 list-disc pl-4">
                  <li>Đặt màu/emoji khác nhau để dễ nhận diện khi đổi lượt.</li>
                  <li>Tên & avatar hiển thị trên top bar và bảng điểm.</li>
                  <li>Reset điểm cho buổi mới, Reset tất cả để về mặc định.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <PlayerSetup />

        <div className="rounded-3xl border border-white/10 bg-white text-zinc-900 shadow-2xl shadow-slate-900/40">
          <GameProvider>
            <Board />
          </GameProvider>
        </div>
      </div>
    </div>
  );
}

