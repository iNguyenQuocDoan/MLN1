"use client";

import React from "react";
import Link from "next/link";

export default function ScenarioPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-12">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Tình huống</h1>
          <Link
            href="/"
            className="rounded-xl border border-white/20 px-3 py-2 text-sm font-medium text-white hover:bg-white/10"
          >
            ← Về Home
          </Link>
        </div>

        {/* YouTube Video Embed */}
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/mtpqRhvQSJ8?si=m0BK5G016jFl3opv"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
      </div>
    </div>
  );
}

