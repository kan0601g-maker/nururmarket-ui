"use client";

import React, { useEffect, useMemo, useState } from "react";

export type Difficulty = "easy" | "normal" | "hard" | "aha";

type State = {
  revealed: boolean[];
  moves: number;
  startedAt: number | null;
  solved: boolean;
  solvedAt: number | null;
  candidates: number[]; // 初期フェーズで「今開けていい候補」
};

const pad2 = (n: number) => String(n).padStart(2, "0");
const formatMs = (ms: number) => {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${pad2(s)}`;
};

const configByDiff = (d: Difficulty) => {
  if (d === "easy") return { size: 6, warmMoves: 3, candidateCount: 6 };
  if (d === "normal") return { size: 10, warmMoves: 5, candidateCount: 8 };
  if (d === "hard") return { size: 14, warmMoves: 7, candidateCount: 10 };
  return { size: 20, warmMoves: 10, candidateCount: 12 }; // aha
};

const makeInitial = (n: number): State => ({
  revealed: Array.from({ length: n * n }, () => false),
  moves: 0,
  startedAt: null,
  solved: false,
  solvedAt: null,
  candidates: [],
});

const shufflePick = (pool: number[], k: number) => {
  const arr = [...pool];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, Math.max(0, Math.min(k, arr.length)));
};

const pieceStyle = (pos: number, size: number, imageSrc: string) => {
  const col = pos % size;
  const row = Math.floor(pos / size);
  const denom = Math.max(1, size - 1);

  return {
    backgroundImage: `url(${imageSrc})`,
    backgroundSize: `${size * 100}% ${size * 100}%`,
    backgroundPosition: `${(col * 100) / denom}% ${(row * 100) / denom}%`,
  } as React.CSSProperties;
};

export default function ChirarizumuGame({
  imageSrc,
  imageKey,
  difficulty = "normal",
}: {
  imageSrc: string;
  imageKey: string;
  difficulty?: Difficulty;
}) {
  const cfg = useMemo(() => configByDiff(difficulty), [difficulty]);
  const size = cfg.size;

  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<State>(() => makeInitial(size));
  const [nowTick, setNowTick] = useState(0);

  useEffect(() => {
    setMounted(true);
    setNowTick(Date.now());
  }, []);

  // 難易度 or 画像が変わったらリセット
  useEffect(() => {
    if (!mounted) return;
    setState(makeInitial(size));
    setNowTick(Date.now());
  }, [mounted, size, imageKey]);

  const refreshCandidates = (revealed: boolean[]) => {
    const pool: number[] = [];
    for (let i = 0; i < revealed.length; i++) if (!revealed[i]) pool.push(i);
    return shufflePick(pool, cfg.candidateCount);
  };

  // 初期候補を用意
  useEffect(() => {
    if (!mounted) return;
    setState((prev) => ({ ...prev, candidates: refreshCandidates(prev.revealed) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, size, imageKey, difficulty]);

  // タイマー更新
  useEffect(() => {
    if (!mounted) return;
    if (state.startedAt === null || state.solved) return;
    const id = window.setInterval(() => setNowTick(Date.now()), 250);
    return () => window.clearInterval(id);
  }, [mounted, state.startedAt, state.solved]);

  const elapsedMs = useMemo(() => {
    if (!mounted || state.startedAt === null) return 0;
    if (state.solvedAt !== null) return state.solvedAt - state.startedAt;
    return nowTick - state.startedAt;
  }, [mounted, state.startedAt, state.solvedAt, nowTick]);

  const isWarmPhase = state.moves < cfg.warmMoves;

  const canOpen = (pos: number) => {
    if (state.revealed[pos]) return false;
    if (!isWarmPhase) return true;
    return state.candidates.includes(pos);
  };

  const open = (pos: number) => {
    if (!mounted) return;

    setState((prev) => {
      if (prev.solved) return prev;
      if (!canOpen(pos)) return prev;

      const startedAt = prev.startedAt ?? Date.now();
      const revealed = [...prev.revealed];
      revealed[pos] = true;

      const moves = prev.moves + 1;

      // クリア条件：全部開いた（あとで “当てる” に変更可）
      const solved = revealed.every(Boolean);
      const solvedAt = solved ? Date.now() : null;

      const nextCandidates = moves < cfg.warmMoves ? refreshCandidates(revealed) : [];

      return {
        ...prev,
        revealed,
        moves,
        startedAt,
        solved,
        solvedAt: solved ? solvedAt : prev.solvedAt,
        candidates: nextCandidates,
      };
    });
  };

  const reset = () => {
    if (!mounted) return;
    setState(makeInitial(size));
    setNowTick(Date.now());
    setTimeout(() => {
      setState((p) => ({ ...p, candidates: refreshCandidates(p.revealed) }));
    }, 0);
  };

  if (!mounted) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm opacity-80">
        <div>
          手数 {state.moves} / 時間 {formatMs(elapsedMs)}
          {isWarmPhase && (
            <span className="ml-3 opacity-80">
              指定めくり残り {Math.max(0, cfg.warmMoves - state.moves)} 手
            </span>
          )}
        </div>

        <button
          onClick={reset}
          className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 hover:bg-white/10 transition"
        >
          リセット
        </button>
      </div>

      {isWarmPhase && (
        <div className="mt-2 text-xs opacity-70">
          最初の{cfg.warmMoves}手は、光ってるマスだけめくれる（ランダム指定）
        </div>
      )}

      <div className="mt-3 relative w-full overflow-hidden rounded-xl border border-white/10">
        <img
          src={imageSrc}
          alt="chirarizumu"
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
          {state.revealed.map((rev, pos) => {
            const enabled = canOpen(pos);
            const isCandidate = isWarmPhase && state.candidates.includes(pos);

            return (
              <button
                key={pos}
                type="button"
                onClick={() => open(pos)}
                aria-label={`chira-${pos}`}
                className={[
                  "w-full h-full border border-white/20 transition",
                  enabled ? "cursor-pointer" : "cursor-not-allowed opacity-70",
                  isCandidate ? "ring-2 ring-yellow-300" : "ring-0",
                ].join(" ")}
                style={
                  rev
                    ? pieceStyle(pos, size, imageSrc)
                    : ({ backgroundColor: "rgba(0,0,0,0.92)" } as React.CSSProperties)
                }
              />
            );
          })}
        </div>

        {state.solved && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3">
            <div className="rounded-xl bg-black/70 px-4 py-2 text-center text-sm text-white">
              全開！ 🎉（次は「当てる」モードに進化できる）
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
