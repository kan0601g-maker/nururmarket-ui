// app/ahatouch/puzzle/play/page.tsx
"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AHA_CATEGORIES } from "../../_components/Categories";
import { listImagesByCategory, type AhaImage } from "../../_components/getImages";

type Difficulty = "easy" | "normal" | "hard";

const AhaPuzzleAny = dynamic(() => import("../../_components/AhaPuzzle"), { ssr: false }) as any;

function findImageSrcById(id: string): string | null {
  for (const c of AHA_CATEGORIES) {
    const list = listImagesByCategory(c.id);
    const hit = list.find((x: AhaImage) => x.id === id);
    if (hit?.src) return hit.src;
  }
  return null;
}

function PlayInner() {
  const sp = useSearchParams();
  const id = sp.get("id") ?? "";
  const diffParam = (sp.get("diff") as Difficulty | null) ?? "normal";
  const diff: Difficulty = diffParam === "easy" || diffParam === "hard" ? diffParam : "normal";

  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setSrc(null);
      return;
    }
    const s = findImageSrcById(id);
    setSrc(s);
  }, [id]);

  const title = useMemo(() => {
    if (!id) return "PUZZLE PLAY";
    const catGuess = id.split("_")[0]; // animals_019 -> animals
    const c = AHA_CATEGORIES.find((x) => x.id === catGuess);
    return c ? `PUZZLE PLAY / ${c.label}` : "PUZZLE PLAY";
  }, [id]);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            <div className="mt-2 text-sm opacity-80">id: {id || "(none)"}</div>
            <div className="mt-1 text-sm opacity-70">difficulty: {diff}</div>
          </div>

          <div className="flex gap-2">
            <Link
              href="/ahatouch/puzzle"
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
              画像が見つかりませんでした（id→src復元に失敗）。
              <div className="mt-2 opacity-60">id: {id}</div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* ここでAhaPuzzleを呼び戻す（props不一致でも落ちないよう any） */}
              <AhaPuzzleAny imageSrc={src} imageKey={id} difficulty={diff} />

              {/* 念のため：パズルが何らかの理由で表示されない場合の保険 */}
              <details className="text-xs opacity-70">
                <summary className="cursor-pointer select-none">画像プレビュー（保険）</summary>
                <div className="mt-2 overflow-hidden rounded-xl border border-white/10">
                  <img src={src} alt={id} className="w-full h-auto" draggable={false} />
                </div>
              </details>
            </div>
          )}
        </div>

        {/* 難易度切り替え（play上でも変更可能にする） */}
        {id && (
          <div className="mt-4 flex flex-wrap gap-2">
            {(["easy", "normal", "hard"] as Difficulty[]).map((d) => {
              const active = d === diff;
              return (
                <Link
                  key={d}
                  href={`/ahatouch/puzzle/play?id=${encodeURIComponent(id)}&diff=${d}`}
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
      <PlayInner />
    </Suspense>
  );
}
