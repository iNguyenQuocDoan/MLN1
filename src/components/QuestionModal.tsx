"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Question } from "@/lib/questions";
import { useGame } from "@/context/GameContext";
import { Sparkles, X, Clock } from "lucide-react";

const QUESTION_TIME_LIMIT = 15; // seconds

// Option button colors
const optionColors = [
  {
    bg: "from-red-500 to-rose-600",
    hover: "hover:from-red-600 hover:to-rose-700",
    light: "bg-red-100 text-red-700",
  },
  {
    bg: "from-blue-500 to-indigo-600",
    hover: "hover:from-blue-600 hover:to-indigo-700",
    light: "bg-blue-100 text-blue-700",
  },
  {
    bg: "from-amber-500 to-orange-600",
    hover: "hover:from-amber-600 hover:to-orange-700",
    light: "bg-amber-100 text-amber-700",
  },
  {
    bg: "from-emerald-500 to-teal-600",
    hover: "hover:from-emerald-600 hover:to-teal-700",
    light: "bg-emerald-100 text-emerald-700",
  },
];

const optionLabels = ["A", "B", "C", "D"];
const CONFETTI_EMOJIS = ["🎉", "⭐", "✨", "🌟", "💫", "🎊", "🏆"] as const;
// Sound effects URLs (using Mixkit CDN directly)
const WRONG_ANSWER_SOUND =
  "https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3";
const CORRECT_ANSWER_SOUND =
  "https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3";
const TIMEOUT_SOUND =
  "https://assets.mixkit.co/active_storage/sfx/2964/2964-preview.mp3";

export function QuestionModal(props: { question: Question }) {
  const { question } = props;
  const { answerQuestion, answerTimeout, closeModal } = useGame();
  const [picked, setPicked] = useState<number | null>(null);
  const [reveal, setReveal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [shakeWrong, setShakeWrong] = useState(false);
  const [celebrationSeed, setCelebrationSeed] = useState<number>(0);
  const [attemptKey, setAttemptKey] = useState<number>(0);
  const lastPlayedAttemptRef = useRef<number>(0);
  const [canContinue, setCanContinue] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT);
  const [isTimedOut, setIsTimedOut] = useState(false);

  // Shuffle options để tránh ghi nhớ vị trí đáp án
  const shuffledQuestion = useMemo(() => {
    const indexMap = question.options.map((_, idx) => idx);
    // Fisher-Yates shuffle
    for (let i = indexMap.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indexMap[i], indexMap[j]] = [indexMap[j], indexMap[i]];
    }
    const shuffledOptions = indexMap.map((idx) => question.options[idx]);
    const newAnswerIndex = indexMap.indexOf(question.answerIndex);
    return {
      ...question,
      options: shuffledOptions,
      answerIndex: newAnswerIndex,
      originalIndexMap: indexMap,
    };
  }, [question]);

  const isCorrect = useMemo(
    () => (picked === null ? null : picked === shuffledQuestion.answerIndex),
    [picked, shuffledQuestion.answerIndex],
  );

  // Countdown timer
  useEffect(() => {
    if (reveal || isTimedOut) return; // Stop timer when answered or timed out

    if (timeLeft <= 0) {
      setIsTimedOut(true);
      setReveal(true);
      setAttemptKey(Date.now());
      setShakeWrong(true);
      setTimeout(() => setShakeWrong(false), 500);
      setTimeout(() => setCanContinue(true), 800);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, reveal, isTimedOut]);

  // Handle timeout finalization
  const handleTimeoutClose = useCallback(() => {
    answerTimeout();
  }, [answerTimeout]);

  const submit = () => {
    if (picked === null) return;
    const correct = picked === shuffledQuestion.answerIndex;

    setReveal(true);
    setAttemptKey(Date.now());
    setCanContinue(false);

    if (correct) {
      setCelebrationSeed(Date.now());
      setShowCelebration(true);
      // Let the player read/celebrate; enable manual continue.
      setTimeout(() => setCanContinue(true), 900);
    } else {
      setShakeWrong(true);
      setTimeout(() => {
        setShakeWrong(false);
      }, 500);
      // Let the player read the explanation; enable manual continue.
      setTimeout(() => setCanContinue(true), 800);
    }
  };

  const finalizeAndClose = () => {
    if (isTimedOut) {
      answerTimeout();
      return;
    }
    if (picked === null) {
      closeModal();
      return;
    }
    answerQuestion(picked === shuffledQuestion.answerIndex);
  };

  // Helper function to play sound
  const playSound = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        const audio = new Audio(src);
        audio.volume = 0.7;
        audio.onerror = () => reject(new Error("Audio load failed"));
        audio.oncanplaythrough = () => {
          void audio.play().then(resolve).catch(reject);
        };
        audio.load();
      } catch (err) {
        reject(err);
      }
    });
  };

  // Play sound when answer is wrong
  useEffect(() => {
    if (!reveal) return;
    if (isCorrect !== false) return;
    if (!attemptKey) return;
    if (lastPlayedAttemptRef.current === attemptKey) return;
    lastPlayedAttemptRef.current = attemptKey;

    playSound(WRONG_ANSWER_SOUND).catch(() => {
      // Silently fail if autoplay restricted
    });
  }, [attemptKey, isCorrect, reveal]);

  // Play sound when answer is correct
  useEffect(() => {
    if (!reveal) return;
    if (isCorrect !== true) return;
    if (!attemptKey) return;
    if (lastPlayedAttemptRef.current === attemptKey) return;
    lastPlayedAttemptRef.current = attemptKey;

    playSound(CORRECT_ANSWER_SOUND).catch(() => {
      // Silently fail if autoplay restricted
    });
  }, [attemptKey, isCorrect, reveal]);

  // Play sound when timeout
  useEffect(() => {
    if (!isTimedOut) return;
    if (!attemptKey) return;
    if (lastPlayedAttemptRef.current === attemptKey) return;
    lastPlayedAttemptRef.current = attemptKey;

    playSound(TIMEOUT_SOUND).catch(() => {
      // Silently fail if autoplay restricted
    });
  }, [attemptKey, isTimedOut]);

  // Confetti particles for celebration
  const confettiParticles = useMemo(() => {
    if (!showCelebration || !celebrationSeed) return [];

    // Simple deterministic PRNG (LCG) so we don't call Math.random() during render.
    let s = celebrationSeed;
    const next = () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 0xffffffff;
    };

    return Array.from({ length: 30 }).map((_, i) => {
      const left = `${next() * 100}%`;
      const top = `${next() * 100}%`;
      const animationDelay = `${next() * 0.5}s`;
      const emoji =
        CONFETTI_EMOJIS[Math.floor(next() * CONFETTI_EMOJIS.length)];
      return {
        key: `${celebrationSeed}-${i}`,
        left,
        top,
        animationDelay,
        emoji,
      };
    });
  }, [celebrationSeed, showCelebration]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {confettiParticles.map((p) => (
            <div
              key={p.key}
              className="absolute text-2xl celebrate"
              style={{
                left: p.left,
                top: p.top,
                animationDelay: p.animationDelay,
              }}
            >
              {p.emoji}
            </div>
          ))}
        </div>
      )}

      <div
        className={[
          "w-full max-w-3xl overflow-hidden rounded-3xl shadow-2xl modal-enter",
          "bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900",
          "border border-white/10",
          shakeWrong ? "shake" : "",
        ].join(" ")}
      >
        {/* Header */}
        <div className="relative border-b border-white/10 p-5">
          {/* Decorative gradient */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.15),transparent_50%)]" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="min-w-0">
              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-3 py-1 text-xs font-bold text-slate-900">
                  <Sparkles className="h-3 w-3" />
                  Câu hỏi
                </span>
                <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-[10px] font-semibold text-emerald-300 ring-1 ring-emerald-500/30">
                  ✓ Đúng = 2 xúc xắc
                </span>
                <span className="rounded-full bg-red-500/20 px-2 py-1 text-[10px] font-semibold text-red-300 ring-1 ring-red-500/30">
                  ✗ Sai = 1 xúc xắc
                </span>
                {/* Countdown Timer */}
                <span
                  className={[
                    "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ring-1",
                    isTimedOut
                      ? "bg-red-500/30 text-red-300 ring-red-500/50"
                      : timeLeft <= 5
                        ? "bg-red-500/20 text-red-300 ring-red-500/30 animate-pulse"
                        : timeLeft <= 10
                          ? "bg-amber-500/20 text-amber-300 ring-amber-500/30"
                          : "bg-white/10 text-white ring-white/20",
                  ].join(" ")}
                >
                  <Clock className="h-3 w-3" />
                  {isTimedOut ? "Hết giờ!" : `${timeLeft}s`}
                </span>
              </div>

              {/* Question */}
              <h3 className="mt-3 text-xl font-bold leading-snug text-white">
                {shuffledQuestion.prompt}
              </h3>

              {/* Meta */}
              <div className="mt-2 flex flex-wrap gap-2">
                {shuffledQuestion.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-white/10 px-2 py-1 text-xs text-purple-200"
                  >
                    #{t}
                  </span>
                ))}
                <span className="rounded-full bg-indigo-500/50 px-2 py-1 text-xs font-semibold text-white">
                  Level {shuffledQuestion.level}
                </span>
              </div>
            </div>

            <button
              onClick={finalizeAndClose}
              className="shrink-0 rounded-xl bg-white/10 p-2 text-white transition-all hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Options */}
        <div className="p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            {shuffledQuestion.options.map((op, idx) => {
              const selected = picked === idx;
              const correct = reveal && idx === shuffledQuestion.answerIndex;
              const wrong =
                reveal && selected && idx !== shuffledQuestion.answerIndex;
              const colors = optionColors[idx];

              return (
                <button
                  key={idx}
                  onClick={() => !reveal && setPicked(idx)}
                  disabled={reveal}
                  className={[
                    "group relative overflow-hidden rounded-2xl border-2 p-4 text-left transition-all duration-300",
                    // Default state
                    !reveal && !selected
                      ? `bg-gradient-to-br ${colors.bg} border-transparent ${colors.hover} hover:scale-[1.02] hover:shadow-lg`
                      : "",
                    // Selected but not revealed
                    selected && !reveal
                      ? "border-white ring-4 ring-white/30 scale-[1.02] shadow-lg"
                      : "",
                    // Correct answer
                    correct
                      ? "bg-gradient-to-br from-emerald-500 to-green-600 border-emerald-300 ring-4 ring-emerald-300/50"
                      : "",
                    // Wrong answer
                    wrong
                      ? "bg-gradient-to-br from-red-600 to-rose-700 border-red-400 opacity-70"
                      : "",
                    // Disabled non-selected
                    reveal && !selected && !correct ? "opacity-40" : "",
                  ].join(" ")}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={[
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold transition-all",
                        selected || correct
                          ? "bg-white text-slate-800"
                          : "bg-white/20 text-white",
                      ].join(" ")}
                    >
                      {optionLabels[idx]}
                    </span>
                    <div className="text-sm font-medium text-white">{op}</div>
                  </div>

                  {/* Correct/Wrong indicators */}
                  {correct && (
                    <span className="absolute right-3 top-3 text-2xl">✓</span>
                  )}
                  {wrong && (
                    <span className="absolute right-3 top-3 text-2xl">✗</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Action Bar */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm font-medium text-white/80">
              {isTimedOut ? (
                <span className="flex items-center gap-2 text-red-300">
                  <span>⏰</span> HẾT GIỜ! Không được gieo xúc xắc!
                </span>
              ) : picked === null ? (
                <span className="flex items-center gap-2">
                  <span>👆</span> Chọn một đáp án
                </span>
              ) : reveal ? (
                isCorrect ? (
                  <span className="flex items-center gap-2 text-emerald-300">
                    <span>🎉</span> TUYỆT VỜI! Đúng rồi!
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-red-300">
                    <span>😔</span> Sai mất rồi...
                  </span>
                )
              ) : (
                <span className="flex items-center gap-2 text-amber-300">
                  <span>✅</span> Đã chọn. Nhấn Xác nhận!
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setReveal((v) => !v)}
                className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-white/20"
              >
                {reveal ? "Ẩn giải thích" : "Xem giải thích"}
              </button>
              <button
                onClick={submit}
                disabled={picked === null || reveal || isTimedOut}
                className={[
                  "rounded-xl px-6 py-2 text-sm font-bold transition-all",
                  "bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900",
                  "hover:from-amber-500 hover:to-yellow-600 hover:shadow-lg hover:shadow-amber-500/30",
                  "disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed disabled:text-slate-600",
                ].join(" ")}
              >
                Xác nhận →
              </button>
              {reveal && (
                <button
                  onClick={finalizeAndClose}
                  disabled={!canContinue}
                  className={[
                    "rounded-xl px-4 py-2 text-sm font-bold transition-all",
                    "bg-white/10 text-white hover:bg-white/20",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                  ].join(" ")}
                >
                  Tiếp tục
                </button>
              )}
            </div>
          </div>

          {/* Explanation */}
          {reveal && (
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 fade-in">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-amber-300">
                <span>💡</span> Giải thích
              </div>
              <div className="mt-2 text-sm leading-relaxed text-white/80">
                {shuffledQuestion.explain}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
