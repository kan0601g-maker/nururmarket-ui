// app/ahatouch/my/play/page.tsx
"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getUserImageSrcById } from "../../_components/userImages";

type Difficulty = "easy" | "normal" | "hard";

const AhaPuzzleAny = dynamic(() => import("../../_components/AhaPuzzle"), { ssr: false }) as any;

function Inner() {
  const sp = useSearchParams();
  const id = sp.get("id") ?? "";
  const diffParam = (sp.get("diff") as Difficulty | null) ?? "normal";
  const diff: Difficulty = diffParam === "easy" || diffParam === "hard" ? diffParam : "normal";

  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!id) {
        setSrc(null);
        return;
      }
      const s = await getUserImageSrcById(id);
      if (!alive) return;
      setSrc(s);
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">MY PLAY</h1>
            <div className="mt-2 text-sm opacity-80">id: {id || "(none)"}</div>
            <div className="mt-1 text-sm opacity-70">difficulty: {diff}</div>
          </div>

          <div className="flex gap-2">
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

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          {!id ? (
            <div className="text-sm opacity-70">id が指定されていません。</div>
          ) : !src ? (
            <div className="text-sm opacity-70">
              画像が見つかりませんでした（端末保存が無い/別端末/ストレージ削除の可能性）。
              <div className="mt-2 opacity-60">id: {id}</div>
            </div>
          ) : (
            <AhaPuzzleAny imageSrc={src} imageKey={id} difficulty={diff} />
          )}
        </div>

        {id && (
          <div className="mt-4 flex flex-wrap gap-2">
            {(["easy", "normal", "hard"] as Difficulty[]).map((d) => {
              const active = d === diff;
              return (
                <Link
                  key={d}
                  href={`/ahatouch/my/play?id=${encodeURIComponent(id)}&diff=${d}`}
                  className={[
                    "rounded-xl px-4 py-2 text-sm border transition",
                    active
                      ? "bg-white text-black border-white"
                      : "bg-white/5 text-white border-white/15 hover:bg-white/10",
                  ].join(" ")}
                >
                  {d === "easy" ? "やさしい" : d === "normal" ? "ふつう" : "上級"}
                </Link>
              );
            })}
          </div>
        )}
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
      <Inner />
    </Suspense>
  );
}
