"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { BookOpen, Quote, ArrowRight, CheckCircle2 } from "lucide-react";
import { SECTIONS } from "./data";

function QuoteBlock({ text, author }: { text: string; author?: string }) {
  return (
    <blockquote className="my-6 border-l-4 border-red-600 bg-red-50 py-4 pl-6 pr-4">
      <Quote className="mb-2 h-6 w-6 text-red-400" />
      <p className="font-serif text-lg italic leading-relaxed text-stone-800">{text}</p>
      {author && <footer className="mt-3 font-sans text-sm font-semibold text-stone-600">— {author}</footer>}
    </blockquote>
  );
}

function NoteBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 rounded-lg border-l-4 border-amber-500 bg-amber-50 p-4">
      <div className="flex items-start gap-3">
        <span className="text-xl">📌</span>
        <p className="text-stone-700">{children}</p>
      </div>
    </div>
  );
}

function HighlightBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white shadow-lg">
      <p className="font-semibold">{children}</p>
    </div>
  );
}

function KeyPoints({ points }: { points: string[] }) {
  return (
    <ul className="my-6 space-y-3">
      {points.map((point, i) => (
        <li key={i} className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
          <span className="text-stone-700">{point}</span>
        </li>
      ))}
    </ul>
  );
}

function ComparisonTable({ before, after }: { before: string[]; after: string[] }) {
  return (
    <div className="my-8 overflow-hidden rounded-xl border border-stone-200 shadow-sm">
      <div className="grid md:grid-cols-2">
        <div className="border-b border-stone-200 bg-stone-100 p-5 md:border-b-0 md:border-r">
          <h4 className="mb-4 flex items-center gap-2 font-sans text-sm font-bold uppercase tracking-wide text-stone-600">
            <span className="h-2 w-2 rounded-full bg-stone-400"></span>
            Trước Đổi mới
          </h4>
          <ul className="space-y-2">
            {before.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-stone-600">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-stone-400"></span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-emerald-50 p-5">
          <h4 className="mb-4 flex items-center gap-2 font-sans text-sm font-bold uppercase tracking-wide text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            Sau Đổi mới
          </h4>
          <ul className="space-y-2">
            {after.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-emerald-800">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"></span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function PollSection({
  choice,
  onChoiceChange,
}: {
  choice: "A" | "B" | null;
  onChoiceChange: (val: "A" | "B") => void;
}) {
  return (
    <div className="my-8 rounded-xl border-2 border-stone-200 bg-white p-6 shadow-sm">
      <h4 className="mb-4 text-lg font-bold text-stone-800">Bạn chọn phương án nào?</h4>
      <div className="grid gap-4 sm:grid-cols-2">
        <button
          onClick={() => onChoiceChange("A")}
          className={`rounded-xl border-2 p-4 text-left transition-all ${
            choice === "A"
              ? "border-red-500 bg-red-50 shadow-md"
              : "border-stone-200 bg-white hover:border-red-300 hover:bg-red-50/50"
          }`}
        >
          <div className="mb-2 text-lg font-bold text-red-700">A. Nên đầu tư</div>
          <p className="text-sm text-stone-600">Ưu tiên xây dựng biểu tượng văn hóa, nâng cao đời sống tinh thần.</p>
        </button>
        <button
          onClick={() => onChoiceChange("B")}
          className={`rounded-xl border-2 p-4 text-left transition-all ${
            choice === "B"
              ? "border-emerald-500 bg-emerald-50 shadow-md"
              : "border-stone-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50"
          }`}
        >
          <div className="mb-2 text-lg font-bold text-emerald-700">B. Không nên</div>
          <p className="text-sm text-stone-600">Ưu tiên phát triển CSHT (sản xuất, an sinh, hạ tầng vật chất).</p>
        </button>
      </div>
      {choice && (
        <div className="mt-6 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 p-5">
          <h5 className="mb-2 font-bold text-amber-800">📊 Phân tích theo lý luận Mác:</h5>
          <p className="text-stone-700">
            Khi <strong className="text-red-700">Cơ sở hạ tầng còn thấp</strong>, nếu đầu tư{" "}
            <strong className="text-red-700">Kiến trúc thượng tầng vượt quá</strong> khả năng kinh tế sẽ tạo mâu thuẫn
            nội tại, thiếu nguồn lực vận hành và không bền vững. Phương án hợp lý: ưu tiên phát triển CSHT trước,
            sau đó KTTT sẽ phát triển tương ứng.
          </p>
        </div>
      )}
    </div>
  );
}

function Section({
  section,
  index,
  pollChoice,
  onPollChange,
}: {
  section: (typeof SECTIONS)[0];
  index: number;
  pollChoice: "A" | "B" | null;
  onPollChange: (val: "A" | "B") => void;
}) {
  return (
    <section id={section.id} className="scroll-mt-20">
      {/* Section Header */}
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white">
            {index + 1}
          </span>
          <span className="text-sm font-medium uppercase tracking-wider text-stone-400">
            Phần {index + 1} / {SECTIONS.length}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-stone-900 md:text-3xl">{section.title}</h2>
        {section.subtitle && <p className="mt-1 text-lg italic text-stone-500">{section.subtitle}</p>}
      </div>

      {/* Section Image */}
      {section.image && (
        <div className="mb-6 overflow-hidden rounded-xl shadow-lg">
          <Image
            src={section.image.src}
            alt={section.image.alt}
            width={900}
            height={400}
            className="h-64 w-full object-cover md:h-80"
          />
        </div>
      )}

      {/* Content */}
      <div className="prose prose-stone max-w-none">
        {section.content.map((para, i) => (
          <p key={i} className="mb-4 text-lg leading-relaxed text-stone-700">
            {para}
          </p>
        ))}
      </div>

      {/* Key Points */}
      {section.keyPoints && <KeyPoints points={section.keyPoints} />}

      {/* Quote */}
      {section.quote && <QuoteBlock text={section.quote.text} author={section.quote.author} />}

      {/* Highlight */}
      {section.highlight && <HighlightBox>{section.highlight}</HighlightBox>}

      {/* Note */}
      {section.note && <NoteBox>{section.note}</NoteBox>}

      {/* Comparison */}
      {section.comparison && <ComparisonTable before={section.comparison.before} after={section.comparison.after} />}

      {/* Poll */}
      {section.interactive === "poll" && <PollSection choice={pollChoice} onChoiceChange={onPollChange} />}
    </section>
  );
}

export default function PresentationPage() {
  const [pollChoice, setPollChoice] = useState<"A" | "B" | null>(null);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero */}
      <div className="bg-gradient-to-b from-red-900 via-red-800 to-stone-900 py-16 text-white md:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur">
            <BookOpen className="h-4 w-4" />
            Bài giảng trực tuyến
          </div>

          <h1 className="mb-4 text-3xl font-bold leading-tight md:text-5xl">
            Giải mã nhận định của <em>Karl Marx</em>
          </h1>

          <p className="mb-8 text-lg text-red-100 md:text-xl">
            Mối quan hệ giữa đời sống vật chất và đời sống tinh thần
          </p>

          <blockquote className="mx-auto max-w-2xl rounded-xl bg-white/10 p-6 backdrop-blur">
            <p className="text-xl italic leading-relaxed md:text-2xl">
              &ldquo;Con người trước hết phải có ăn, ở, mặc, đi lại, sau đó mới có thể làm chính trị, khoa học, nghệ thuật,
              tôn giáo.&rdquo;
            </p>
            <footer className="mt-4 text-sm font-semibold text-red-200">— Karl Marx</footer>
          </blockquote>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="border-b border-stone-200 bg-white py-8">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-stone-500">Mục lục</h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {SECTIONS.map((section, idx) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="group flex items-center gap-2 rounded-lg border border-stone-200 p-3 transition-all hover:border-red-300 hover:bg-red-50"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-stone-100 text-xs font-bold text-stone-600 group-hover:bg-red-600 group-hover:text-white">
                  {idx + 1}
                </span>
                <span className="text-sm font-medium text-stone-700 group-hover:text-red-700">
                  {section.title.length > 25 ? section.title.slice(0, 25) + "..." : section.title}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Introduction */}
      <div className="border-b border-stone-200 bg-white py-12">
        <div className="mx-auto max-w-3xl px-4">
          <p className="text-lg leading-relaxed text-stone-700">
            Nhận định trên không mang tính đời thường mà là <strong>kết tinh lý luận</strong> của{" "}
            <strong className="text-red-700">Học thuyết hình thái kinh tế – xã hội</strong>. Nó phản ánh mối quan hệ
            biện chứng giữa <strong>Cơ sở hạ tầng (CSHT)</strong> và{" "}
            <strong>Kiến trúc thượng tầng (KTTT)</strong> trong sự vận động và phát triển của xã hội loài người.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-stone-700">
            Bài giảng này sẽ giúp bạn hiểu rõ nội hàm của các khái niệm, quy luật biện chứng giữa chúng, và cách vận
            dụng vào phân tích thực tiễn Việt Nam cũng như đời sống sinh viên.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="py-12">
        <div className="mx-auto max-w-3xl px-4">
          <div className="space-y-16">
            {SECTIONS.map((section, idx) => (
              <Section
                key={section.id}
                section={section}
                index={idx}
                pollChoice={pollChoice}
                onPollChange={setPollChoice}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 py-12 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="mb-4 text-2xl font-bold">Kiểm tra kiến thức của bạn</h2>
          <p className="mb-6 text-red-100">
            Sau khi đọc xong bài giảng, hãy làm bài kiểm tra để củng cố kiến thức về CSHT và KTTT.
          </p>
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-red-600 shadow-lg transition-all hover:bg-red-50"
          >
            Làm bài kiểm tra
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-8">
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="text-sm text-stone-500">
              © 2024 Marx-opoly • Ứng dụng học tập Triết học Mác-Lênin
            </div>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-sm text-stone-500 hover:text-red-600">
                Trang chủ
              </Link>
              <Link href="/game" className="text-sm text-stone-500 hover:text-red-600">
                Chơi game
              </Link>
              <Link href="/quiz" className="text-sm text-stone-500 hover:text-red-600">
                Làm quiz
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
