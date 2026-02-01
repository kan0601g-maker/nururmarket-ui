"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { getUserImageSrcById, revokeUrl } from "../../_components/userImages";
import { AhaPuzzle } from "../../_components/AhaPuzzle";

type Difficulty = "easy" | "normal" | "hard";

function PlayInner() {
  const sp = useSearchParams();
  const idFromQuery = sp.get("id") ?? "";

  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!idFromQuery) {
      setSrc(null);
      return;
    }

    let alive = true;
    let lastUrl: string | null = null;

    (async () => {
      const url = await getUserImageSrcById(idFromQuery);
      if (!alive) return;

      if (lastUrl) revokeUrl(lastUrl);
      lastUrl = url;

      setSrc(url);
    })();

    return () => {
      alive = false;
      if (lastUrl) revokeUrl(lastUrl);
    };
  }, [idFromQuery]);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">MY パズル</h1>
            <p className="mt-1 text-sm opacity-70">difficulty: {difficulty}</p>
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
              imageKey={idFromQuery}                 // ✅ AhaPuzzleが要求
              initialDifficulty={difficulty}         // ✅ difficulty → initialDifficulty
              onDifficultyChange={setDifficulty}     // ✅ これは残してOK（型が通るなら）
            />
          ) : (
            <div className="text-sm opacity-70">読み込み中…</div>
          )}
        </div>
      </div>
    </main>
  );
}

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
