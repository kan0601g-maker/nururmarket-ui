"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

// 既存の import はここに残してOK（例）
// import { ... } from "../../_components/....";

function PlayInner() {
  const sp = useSearchParams();

  // ✅ ここで query を読む（Suspense の内側だからビルド通る）
  const idFromQuery = sp.get("id") ?? "";

  // ====== ここから下は「いま君が書いてる play の中身」を入れる ======
  // 例：state
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // 例：初期化
    setReady(true);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">チラリズム PLAY</h1>
            <p className="mt-1 text-sm opacity-70">id: {idFromQuery || "(none)"}</p>
          </div>

          <Link
            href="/ahatouch/chirarizumu"
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
          >
            戻る
          </Link>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
          {ready ? (
            <div className="text-sm opacity-80">
              ここに既存の play ロジック/UI を戻してOK
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
