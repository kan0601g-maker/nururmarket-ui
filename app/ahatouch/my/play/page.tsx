"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { getUserImagesSrcById, revokeUrl } from "../../_components/userImages";
import { AhaPuzzle } from "../../_components/AhaPuzzle";

type Difficulty = "easy" | "normal" | "hard";

/**
 * ✅ useSearchParams を使う処理は必ず Suspense の内側へ
 */
function MyAhaPlayInner() {
  const sp = useSearchParams();
  const id = sp.get("id") ?? "";

  const [difficulty, setDifficulty] = useState<Difficulty>("easy");

  // 表示用URL（例：userImages側で objectURL を返す想定）
  const [src, setSrc] = useState<string>("");

  useEffect(() => {
    let alive = true;

    (async () => {
      if (!id) {
        setSrc("");
        return;
      }
      const url = await getUserImagesSrcById(id);
      if (!alive) {
        revokeUrl(url);
        return;
      }
      setSrc(url);
    })();

    return () => {
      alive = false;
      if (src) revokeUrl(src);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const size = useMemo(() => {
    if (difficulty === "easy") return 3;
    if (difficulty === "normal") return 4;
    return 5;
  }, [difficulty]);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">MY PLAY</h1>
            <p className="mt-1 text-sm opacity-70">id: {id || "(none)"}</p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/ahatouch/my"
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
            >
              戻る
            </Link>
            <Link
              href="/ahatouch"
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
            >
              AHA TOUCH HOME
            </Link>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {(["easy", "normal", "hard"] as Difficulty[]).map((d) => {
            const active = d === difficulty;
            return (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={[
                  "rounded-xl px-4 py-2 text-sm border transition",
                  active
                    ? "bg-white text-black border-white"
                    : "bg-white/5 text-white border-white/15 hover:bg-white/10",
                ].join(" ")}
              >
                {d === "easy" ? "やさしい" : d === "normal" ? "ふつう" : "上級"}
              </button>
            );
          })}
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
          {!id ? (
            <div className="text-sm opacity-70">id がありません（一覧から選んでね）</div>
          ) : !src ? (
            <div className="text-sm opacity-70">画像読み込み中…</div>
          ) : (
            <AhaPuzzle imageSrc={src} size={size} />
          )}
        </div>
      </div>
    </main>
  );
}

/**
 * ✅ default export は Suspense で包むだけ（これがビルド通す本体）
 */
export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-sm opacity-70">読み込み中…</div>
        </main>
      }
    >
      <MyAhaPlayInner />
    </Suspense>
  );
}
