"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// いまの play が持ってる import はここに追加でOK
// import { ... } from "../../_components/....";

function MyPlayInner() {
  const sp = useSearchParams();

  // ✅ query は Inner で読む（Suspense の内側）
  const id = sp.get("id") ?? "";
  const mode = sp.get("mode") ?? "";

  // ↓ここから下に、いまの /ahatouch/my/play の中身を戻す
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">MY PLAY</h1>
            <p className="mt-1 text-sm opacity-70">
              id: {id || "(none)"} / mode: {mode || "(none)"}
            </p>
          </div>

          <Link
            href="/ahatouch/my"
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
          >
            戻る
          </Link>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
          {ready ? (
            <div className="text-sm opacity-80">
              ここに既存の my/play のUIとロジックを戻してOK
            </div>
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
      <MyPlayInner />
    </Suspense>
  );
}
