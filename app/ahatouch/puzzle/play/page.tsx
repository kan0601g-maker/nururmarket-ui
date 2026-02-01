"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import AhaPuzzle from "../../_components/AhaPuzzle";

type Difficulty = "easy" | "normal" | "hard";

const DIFFS: { key: Difficulty; label: string }[] = [
  { key: "easy", label: "やさしい" },
  { key: "normal", label: "ふつう" },
  { key: "hard", label: "上級" },
];

export default function AhaPuzzlePlayPage() {
  const sp = useSearchParams();

  const id = (sp.get("id") ?? "").trim();
  const cat = (sp.get("cat") ?? "").trim();

  const [difficulty, setDifficulty] = useState<Difficulty>("easy");

  const imageSrc = useMemo(() => {
    const inferred = id.includes("_") ? id.split("_")[0] : cat || "animals";
    const safeCat =
      inferred === "animals" || inferred === "flowers" || inferred === "world"
        ? inferred
        : "animals";

    if (!id) return "";
    return `/ahatouch/${safeCat}/${id}.webp`;
  }, [id, cat]);

  if (!id || !imageSrc) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <h1 className="text-2xl font-bold">AHA TOUCH パズル</h1>
          <p className="mt-2 text-sm opacity-80">画像IDが指定されていません。</p>
          <Link
            href="/ahatouch/puzzle"
            className="mt-6 inline-block rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
          >
            ← 戻る
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* ★スマホだけ max-w-none + 余白を詰める */}
      <div className="mx-auto w-full max-w-none sm:max-w-5xl px-3 sm:px-6 py-6 sm:py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">AHA TOUCH パズル</h1>
            <p className="mt-2 text-sm opacity-80">画像: {id}</p>
          </div>

          <Link
            href="/ahatouch/puzzle"
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
          >
            ← カテゴリへ戻る
          </Link>
        </div>

        {/* 難易度ボタン */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <div className="mr-2 text-sm font-semibold opacity-80">難易度</div>
          {DIFFS.map((d) => {
            const active = d.key === difficulty;
            return (
              <button
                key={d.key}
                onClick={() => setDifficulty(d.key)}
                className={[
                  "rounded-xl border px-4 py-2 text-sm transition touch-manipulation",
                  active
                    ? "bg-white text-black border-white"
                    : "bg-white/5 text-white border-white/15 hover:bg-white/10",
                ].join(" ")}
              >
                {d.label}
              </button>
            );
          })}
        </div>

        <div className="mt-6">
          <AhaPuzzle imageSrc={imageSrc} imageKey={id} initialDifficulty={difficulty} />
        </div>
      </div>
    </main>
  );
}
