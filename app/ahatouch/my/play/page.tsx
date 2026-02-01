"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import {
  getUserImageSrcById, // ✅ 単数形
  revokeUrl,
} from "../../_components/userImages";

import { AhaPuzzle } from "../../_components/AhaPuzzle";

type Difficulty = "easy" | "normal" | "hard";

/* ===== Suspense 内側 ===== */
function PlayInner() {
  const sp = useSearchParams();
  const idFromQuery = sp.get("id") ?? "";

  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!idFromQuery) return;

    let alive = true;
    const url = getUserImageSrcById(idFromQuery);

    if (alive) setSrc(url);

    return () => {
      alive = false;
      if (url) revokeUrl(url);
    };
  }, [idFromQuery]);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">MY パズル</h1>
            <p className="mt-1 text-sm opacity-70">
              difficulty: {difficulty}
            </p>
          </div>

          <Link
            href="/ahatouch/my"
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
          >
            戻る
          </Link>
        </div>

        <div className="mt-6">
          {src ? (
            <AhaPuzzle
              imageSrc={src}
              difficulty={difficulty}
              onDifficultyChange={setDifficulty}
            />
          ) : (
            <div className="text-sm opacity-70">読み込み中…</div>
          )}
        </div>
      </div>
    </main>
  );
}

/* ===== 外側（Suspense） ===== */
export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-sm opacity-70">読み込み中…</div>
        </main>
      }
    >
      <PlayInner />
    </Suspense>
  );
}
