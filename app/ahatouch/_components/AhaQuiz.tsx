"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  imageSrc: string;
  cols: number;
  rows: number;

  // 追加：めくれる上限（未指定なら無制限）
  maxFlips?: number;

  // 追加：めくった枚数通知
  onFlipCountChange?: (count: number) => void;

  // 追加：上限に達してめくれなかった時
  onLockHit?: () => void;

  // 追加：外からリセットしたい時のキー
  quizKey?: string;
};

export default function AhaQuiz({
  imageSrc,
  cols,
  rows,
  maxFlips,
  onFlipCountChange,
  onLockHit,
  quizKey,
}: Props) {
  const total = cols * rows;

  const [flipped, setFlipped] = useState<boolean[]>(() =>
    Array(total).fill(false)
  );

  useEffect(() => {
    setFlipped(Array(total).fill(false));
  }, [imageSrc, cols, rows, quizKey, total]);

  const flippedCount = useMemo(
    () => flipped.filter(Boolean).length,
    [flipped]
  );

  useEffect(() => {
    onFlipCountChange?.(flippedCount);
  }, [flippedCount, onFlipCountChange]);

  const canFlipMore = useMemo(() => {
    if (typeof maxFlips !== "number") return true;
    return flippedCount < maxFlips;
  }, [maxFlips, flippedCount]);

  const onToggle = (idx: number) => {
    setFlipped((prev) => {
      const next = [...prev];
      const isOpen = !!next[idx];

      // 閉じるのは常にOK
      if (isOpen) {
        next[idx] = false;
        return next;
      }

      // 開くときだけ制限
      if (!canFlipMore) {
        onLockHit?.();
        return prev;
      }

      next[idx] = true;
      return next;
    });
  };

  const tileStyle = (i: number) => {
    const x = i % cols;
    const y = Math.floor(i / cols);

    return {
      backgroundImage: `url(${imageSrc})`,
      backgroundSize: `${cols * 100}% ${rows * 100}%`,
      backgroundPosition: `${(x * 100) / (cols - 1 || 1)}% ${
        (y * 100) / (rows - 1 || 1)
      }%`,
    } as React.CSSProperties;
  };

  return (
    <div className="w-full">
      <div
        className="grid gap-1 rounded-2xl border border-white/10 bg-white/5 p-2"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: total }).map((_, i) => {
          const isOpen = flipped[i];
          return (
            <button
              key={i}
              type="button"
              onClick={() => onToggle(i)}
              className={[
                "aspect-square rounded-lg border border-white/10 overflow-hidden transition",
                isOpen ? "bg-black/10" : "bg-black/40 hover:bg-black/30",
              ].join(" ")}
            >
              {isOpen ? (
                <div className="h-full w-full" style={tileStyle(i)} />
              ) : (
                <div className="h-full w-full bg-black/40" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-3 text-xs opacity-70">
        {typeof maxFlips === "number" ? (
          <span>
            めくり：{flippedCount}/{maxFlips}
          </span>
        ) : (
          <span>めくり：{flippedCount}</span>
        )}
      </div>
    </div>
  );
}
