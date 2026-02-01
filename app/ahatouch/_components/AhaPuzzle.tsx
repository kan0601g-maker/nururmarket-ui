"use client";

import React, { useEffect, useMemo, useState } from "react";

type Difficulty = "easy" | "normal" | "hard";

type PuzzleState = {
  order: number[];
  selected: number | null;
  moves: number;
  startedAt: number | null;
  solved: boolean;
  solvedAt: number | null;
};

type PuzzleBest = { moves: number; timeMs: number };

const pad2 = (n: number) => String(n).padStart(2, "0");
const formatMs = (ms: number) => {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${pad2(s)}`;
};

/**
 * ✅ 難易度の分割数
 * - easy: 4x4（現状維持）
 * - normal: 5x5（現状維持）
 * - hard: 10x10（要件）
 */
const sizeByDifficulty = (d: Difficulty) => {
  if (d === "easy") return 4;
  if (d === "normal") return 6;
  return 10;
};

const defaultGoalMoves = (d: Difficulty) => {
  if (d === "easy") return 20;
  if (d === "normal") return 50;
  return 90;
};

const calcGoals = (bestMoves: number | null, d: Difficulty) => {
  if (bestMoves === null) {
    const g = defaultGoalMoves(d);
    return { goal: g, stretch: Math.max(1, g - 5) };
  }
  return {
    goal: Math.max(1, bestMoves - 1),
    stretch: Math.max(1, bestMoves - 2),
  };
};

const isSolved = (order: number[]) => order.every((v, i) => v === i);

// 🔒 SSR用：ランダムを使わない固定初期盤面
const makeInitialPuzzle = (size: number): PuzzleState => ({
  order: Array.from({ length: size * size }, (_, i) => i),
  selected: null,
  moves: 0,
  startedAt: null,
  solved: false,
  solvedAt: null,
});

// 🎲 クライアント専用シャッフル
const shuffleOrder = (n: number) => {
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  if (isSolved(arr) && n >= 2) [arr[0], arr[1]] = [arr[1], arr[0]];
  return arr;
};

const makePuzzle = (size: number): PuzzleState => ({
  order: shuffleOrder(size * size),
  selected: null,
  moves: 0,
  startedAt: null,
  solved: false,
  solvedAt: null,
});

// ベスト比較
const isBetter = (cand: PuzzleBest, cur: PuzzleBest | null) => {
  if (!cur) return true;
  if (cand.moves < cur.moves) return true;
  if (cand.moves > cur.moves) return false;
  return cand.timeMs < cur.timeMs;
};

const bestKey = (imageKey: string, difficulty: Difficulty) =>
  `ahatouch_best_${imageKey}_${difficulty}`;

const loadBest = (imageKey: string, difficulty: Difficulty): PuzzleBest | null => {
  try {
    const raw = localStorage.getItem(bestKey(imageKey, difficulty));
    if (!raw) return null;
    const obj = JSON.parse(raw);
    if (typeof obj.moves === "number" && typeof obj.timeMs === "number") {
      return { moves: obj.moves, timeMs: obj.timeMs };
    }
  } catch {}
  return null;
};

const saveBest = (imageKey: string, difficulty: Difficulty, best: PuzzleBest) => {
  try {
    localStorage.setItem(bestKey(imageKey, difficulty), JSON.stringify(best));
  } catch {}
};

const pieceStyle = (pieceIndex: number, size: number, imageSrc: string) => {
  const col = pieceIndex % size;
  const row = Math.floor(pieceIndex / size);
  const denom = Math.max(1, size - 1);

  return {
    backgroundImage: `url(${imageSrc})`,
    backgroundSize: `${size * 100}% ${size * 100}%`,
    backgroundPosition: `${(col * 100) / denom}% ${(row * 100) / denom}%`,
  } as React.CSSProperties;
};

export function AhaPuzzle({
  imageSrc,
  imageKey,
  /**
   * ✅ 新：親から difficulty を渡せる（play側から渡してるのはこれ）
   * - "easy" | "normal" | "hard"
   */
  difficulty,
  /**
   * ✅ 旧：互換のため残す（過去コードが initialDifficulty を渡しててもOK）
   */
  initialDifficulty = "easy",
}: {
  imageSrc: string;
  imageKey: string;
  difficulty?: Difficulty;
  initialDifficulty?: Difficulty;
}) {
  // ✅ difficulty を優先（なければ initialDifficulty）
  const [diff, setDiff] = useState<Difficulty>(difficulty ?? initialDifficulty);
  const size = useMemo(() => sizeByDifficulty(diff), [diff]);

  // ★ hydration対策用フラグ
  const [mounted, setMounted] = useState(false);

  // ★ SSR安全な初期state
  const [puzzle, setPuzzle] = useState<PuzzleState>(() => makeInitialPuzzle(size));
  const [best, setBest] = useState<PuzzleBest | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [nowTick, setNowTick] = useState(0);

  useEffect(() => {
    setMounted(true);
    setNowTick(Date.now());
  }, []);

  // 親から難易度が変わったら追従（difficulty優先）
  useEffect(() => {
    setDiff(difficulty ?? initialDifficulty);
  }, [difficulty, initialDifficulty]);

  // ★ クライアントマウント後にシャッフル
  useEffect(() => {
    if (!mounted) return;
    setPuzzle(makePuzzle(size));
    setBest(loadBest(imageKey, diff));
    setToast(null);
  }, [mounted, size, diff, imageKey]);

  // タイマー更新
  useEffect(() => {
    if (!mounted) return;
    if (puzzle.startedAt === null || puzzle.solved) return;

    const id = window.setInterval(() => setNowTick(Date.now()), 250);
    return () => window.clearInterval(id);
  }, [mounted, puzzle.startedAt, puzzle.solved]);

  const elapsedMs = useMemo(() => {
    if (!mounted || puzzle.startedAt === null) return 0;
    if (puzzle.solvedAt !== null) return puzzle.solvedAt - puzzle.startedAt;
    return nowTick - puzzle.startedAt;
  }, [mounted, puzzle.startedAt, puzzle.solvedAt, nowTick]);

  const bestMovesForGoal = best ? best.moves : null;
  const { goal, stretch } = calcGoals(bestMovesForGoal, diff);

  const shuffle = () => {
    if (!mounted) return;
    setPuzzle(makePuzzle(size));
    setToast(null);
  };

  const tap = (pos: number) => {
    if (!mounted) return;

    setPuzzle((prev) => {
      if (prev.solved) return prev;
      const startedAt = prev.startedAt ?? Date.now();

      if (prev.selected === null) return { ...prev, selected: pos, startedAt };
      if (prev.selected === pos) return { ...prev, selected: null };

      const nextOrder = [...prev.order];
      const a = prev.selected;
      const b = pos;
      [nextOrder[a], nextOrder[b]] = [nextOrder[b], nextOrder[a]];

      const nextMoves = prev.moves + 1;
      const solved = isSolved(nextOrder);

      if (solved) {
        const solvedAt = Date.now();
        const timeMs = solvedAt - startedAt;
        const candidate = { moves: nextMoves, timeMs };

        const currentBest = best ?? loadBest(imageKey, diff);
        if (isBetter(candidate, currentBest)) {
          saveBest(imageKey, diff, candidate);
          setBest(candidate);
        }

        setToast("Aha!! 🎉");

        return {
          ...prev,
          order: nextOrder,
          selected: null,
          moves: nextMoves,
          startedAt,
          solved: true,
          solvedAt,
        };
      }

      return { ...prev, order: nextOrder, selected: null, moves: nextMoves, startedAt };
    });
  };

  if (!mounted) return null; // ← iPhoneのhydration警告を消す

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm opacity-80">
        <div>
          手数 {puzzle.moves} / 時間 {formatMs(elapsedMs)}
          <span className="ml-3">ベスト：{best ? `${best.moves} 手 / ${formatMs(best.timeMs)}` : "—"}</span>
        </div>

        <button
          onClick={shuffle}
          className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 hover:bg-white/10 transition"
        >
          シャッフル
        </button>
      </div>

      <div className="mt-2 text-sm opacity-80">
        目標 {goal} 手（ストレッチ {stretch} 手）
      </div>

      <div className="mt-3 relative w-full overflow-hidden rounded-xl border border-white/10">
        {/* ✅ スマホだけ “高さを確保してデカく見せる” */}
        <img
          src={imageSrc}
          alt="AhaPuzzle"
          className="block w-full h-[56vh] sm:h-auto object-cover sm:object-contain select-none"
          draggable={false}
        />

        <div
          className="absolute inset-0 grid gap-[2px] p-[2px]"
          style={{
            gridTemplateColumns: `repeat(${size}, 1fr)`,
            gridTemplateRows: `repeat(${size}, 1fr)`,
          }}
        >
          {puzzle.order.map((pieceIndex, pos) => {
            const selected = puzzle.selected === pos;
            return (
              <button
                key={pos}
                type="button"
                onClick={() => tap(pos)}
                aria-label={`puzzle-pos-${pos}`}
                className={[
                  "w-full h-full",
                  "border border-white/30",
                  "transition-all duration-150 ease-out",
                  // スマホで「押せた」が分かる演出
                  "active:scale-95 active:ring-4 active:ring-pink-400",
                  selected
                    ? "shadow-[0_12px_30px_rgba(0,0,0,0.55)] ring-4 ring-yellow-300 scale-[1.03]"
                    : "shadow-none ring-0 scale-100",
                ].join(" ")}
                style={pieceStyle(pieceIndex, size, imageSrc)}
              />
            );
          })}
        </div>

        {toast && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3">
            <div className="rounded-xl bg-black/70 px-4 py-2 text-center text-sm text-white">
              {toast}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AhaPuzzle;
