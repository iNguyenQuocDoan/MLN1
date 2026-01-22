"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Home, Lightbulb, Presentation, CheckCircle2, Quote } from "lucide-react";
import { SECTIONS } from "../data";

function PollSection({
  choice,
  onChoiceChange,
}: {
  choice: "A" | "B" | null;
  onChoiceChange: (val: "A" | "B") => void;
}) {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-4">
      <div className="mb-2 text-sm font-semibold text-amber-900">Chọn đáp án:</div>
      <div className="grid gap-2 sm:grid-cols-2">
        <button
          onClick={() => onChoiceChange("A")}
          className={`rounded-lg border p-3 text-left transition ${
            choice === "A"
              ? "border-red-300 bg-red-50 ring-2 ring-red-200"
              : "border-amber-200 bg-white hover:bg-amber-50"
          }`}
        >
          <div className="text-sm font-semibold text-red-700">A. Nên</div>
          <div className="mt-0.5 text-xs text-slate-600">Ưu tiên biểu tượng văn hóa.</div>
        </button>
        <button
          onClick={() => onChoiceChange("B")}
          className={`rounded-lg border p-3 text-left transition ${
            choice === "B"
              ? "border-emerald-300 bg-emerald-50 ring-2 ring-emerald-200"
              : "border-amber-200 bg-white hover:bg-amber-50"
          }`}
        >
          <div className="text-sm font-semibold text-emerald-700">B. Không nên</div>
          <div className="mt-0.5 text-xs text-slate-600">Ưu tiên nâng CSHT trước.</div>
        </button>
      </div>
      {choice && (
        <div className="mt-3 rounded-lg border border-red-200 bg-white p-3 text-sm text-slate-800">
          <div className="mb-1 font-semibold text-red-700">Phân tích:</div>
          <p className="text-xs">
            Khi CSHT còn thấp, đầu tư KTTT vượt quá sẽ tạo mâu thuẫn và không bền vững.
          </p>
        </div>
      )}
    </div>
  );
}

function QuoteBlock({ text, author }: { text: string; author?: string }) {
  return (
    <blockquote className="relative border-l-4 border-slate-400 bg-slate-50 py-3 pl-4 pr-3 italic">
      <Quote className="absolute -left-2 -top-1 h-4 w-4 rotate-180 bg-white text-slate-400" />
      <p className="text-sm leading-relaxed text-slate-700">{text}</p>
      {author && <footer className="mt-2 text-xs font-medium text-slate-500">— {author}</footer>}
    </blockquote>
  );
}

function HighlightBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm">
      <div className="shrink-0">👉</div>
      <p className="font-semibold text-blue-900">{children}</p>
    </div>
  );
}

function KeyPoints({ points }: { points: string[] }) {
  return (
    <ul className="space-y-1.5">
      {points.map((point, i) => (
        <li key={i} className="flex items-start gap-2 text-sm">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          <span className="text-slate-700">{point}</span>
        </li>
      ))}
    </ul>
  );
}

function ComparisonTable({ before, after }: { before: string[]; after: string[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-lg border border-slate-300 bg-slate-50 p-3">
        <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Trước Đổi mới</h4>
        <ul className="space-y-1">
          {before.map((item, i) => (
            <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
              <span className="text-slate-400">•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-3">
        <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-emerald-700">Sau Đổi mới</h4>
        <ul className="space-y-1">
          {after.map((item, i) => (
            <li key={i} className="flex items-start gap-1.5 text-xs text-emerald-800">
              <span className="text-emerald-500">•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function SectionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [showNotes, setShowNotes] = useState(false);
  const [pollChoice, setPollChoice] = useState<"A" | "B" | null>(null);

  const sectionId = params?.id as string;
  const section = SECTIONS.find((s) => s.id === sectionId);
  const sectionIndex = section ? SECTIONS.findIndex((s) => s.id === sectionId) : -1;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "n") setShowNotes((v) => !v);
      if (e.key === "Escape") router.push("/presentation");
      if (e.key === "ArrowLeft" && sectionIndex > 0) {
        router.push(`/presentation/${SECTIONS[sectionIndex - 1].id}`);
      }
      if (e.key === "ArrowRight" && sectionIndex < SECTIONS.length - 1) {
        router.push(`/presentation/${SECTIONS[sectionIndex + 1].id}`);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router, sectionIndex]);

  if (!section) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">Không tìm thấy section</h1>
          <Link href="/presentation" className="mt-4 inline-block text-red-600 hover:underline">
            ← Về trang chính
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-2 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/presentation"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Tổng quan
            </Link>
            <div className="text-xs text-slate-700">
              Phần <span className="font-semibold text-slate-900">{sectionIndex + 1}</span>/{SECTIONS.length}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              <Home className="h-3.5 w-3.5" />
              Home
            </Link>
            {section.note && (
              <button
                onClick={() => setShowNotes((v) => !v)}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium ${
                  showNotes
                    ? "border-amber-300 bg-amber-100 text-amber-800"
                    : "border-amber-200 bg-white text-amber-700 hover:bg-amber-50"
                }`}
                title="Bật/tắt ghi chú (phím N)"
              >
                <Lightbulb className="h-3.5 w-3.5" />
                Ghi chú
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 py-6">
        <article className="rounded-xl border border-slate-200 bg-white shadow-sm">
          {/* Two-column layout */}
          <div className="grid lg:grid-cols-2">
            {/* Left: Image */}
            {section.image && (
              <div className="border-b border-slate-200 lg:border-b-0 lg:border-r">
                <Image
                  src={section.image.src}
                  alt={section.image.alt}
                  width={600}
                  height={400}
                  className="h-48 w-full object-cover lg:h-full lg:rounded-l-xl"
                  priority
                />
              </div>
            )}

            {/* Right: Content */}
            <div className="p-5 lg:p-6">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-700">
                  {sectionIndex + 1}
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-700 ring-1 ring-red-200">
                    <Presentation className="h-3 w-3" />
                    Triết học Mác – Lênin
                  </div>
                </div>
              </div>

              <h1 className="text-lg font-bold text-slate-900 md:text-xl">{section.title}</h1>
              {section.subtitle && (
                <p className="mt-0.5 text-sm italic text-slate-500">{section.subtitle}</p>
              )}

              <div className="mt-4 space-y-3">
                {/* Content paragraphs */}
                <div className="space-y-2 text-sm text-slate-700">
                  {section.content.map((para, i) => (
                    <p key={i} className="leading-relaxed">{para}</p>
                  ))}
                </div>

                {/* Key Points */}
                {section.keyPoints && <KeyPoints points={section.keyPoints} />}

                {/* Quote */}
                {section.quote && <QuoteBlock text={section.quote.text} author={section.quote.author} />}

                {/* Highlight */}
                {section.highlight && <HighlightBox>{section.highlight}</HighlightBox>}

                {/* Comparison */}
                {section.comparison && (
                  <ComparisonTable before={section.comparison.before} after={section.comparison.after} />
                )}

                {/* Poll */}
                {section.interactive === "poll" && (
                  <PollSection choice={pollChoice} onChoiceChange={setPollChoice} />
                )}

                {/* Note (shown when toggled) */}
                {showNotes && section.note && (
                  <div className="rounded-lg border border-slate-300 bg-slate-50 p-3 text-sm text-slate-700">
                    <div className="mb-1 flex items-center gap-1.5 font-semibold text-slate-900">
                      <Lightbulb className="h-3.5 w-3.5 text-amber-600" />
                      Ghi chú thuyết trình
                    </div>
                    <p className="text-xs">{section.note}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </article>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between gap-4">
          {sectionIndex > 0 ? (
            <Link
              href={`/presentation/${SECTIONS[sectionIndex - 1].id}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Phần trước
            </Link>
          ) : (
            <div />
          )}
          {sectionIndex < SECTIONS.length - 1 ? (
            <Link
              href={`/presentation/${SECTIONS[sectionIndex + 1].id}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Phần sau
              <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
            </Link>
          ) : (
            <Link
              href="/presentation"
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
            >
              Hoàn thành
              <CheckCircle2 className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        {/* Keyboard hints */}
        <div className="mt-4 text-center text-[10px] text-slate-400">
          Phím tắt: ← → điều hướng • N xem ghi chú • Esc về tổng quan
        </div>
      </main>
    </div>
  );
}
