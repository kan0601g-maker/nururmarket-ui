// app/ahatouch/puzzle/play/page.tsx
"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

// ※ ここは君の実装に合わせて import を残してOK
// 例）import { AhaPuzzle } from "../../_components/AhaPuzzle";
// 例）import { getImageSrcById, revokeUrl } from "../../_components/....";

function PlayInner() {
  const sp = useSearchParams();

  // ✅ Suspenseの内側で query を読む
  const idFromQuery = sp.get("id") ?? "";

  // ======= ここから下は「今ある play の中身」を入れる =======
  // 例：状態
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // 初期化（必要なら）
    setReady(true);
  }, []);

  // ここに、既存の play ロジック（画像取得 / difficulty / UIなど）を貼る
  // 重要：useSearchParams() はこの PlayInner の中だけで使うこと

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">PUZZLE PLAY</h1>
            <p className="mt-2 text-sm opacity-70">id: {idFromQuery || "(none)"}</p>
          </div>

          <div className="flex items-center gap-2">
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

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
          {ready ? (
            <div className="text-sm opacity-80">
              ✅ ここに既存のパズルUIを戻す（AhaPuzzleなど）
              <br />
              例：<code>{`<AhaPuzzle imageSrc={src} imageKey={idFromQuery} ... />`}</code>
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
  // ✅ これがビルドエラーを止める本体
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
