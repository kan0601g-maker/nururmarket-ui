"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  getUserImageSrcById,
  revokeUrl,
} from "../../_components/userImages";
import { AhaPuzzle } from "../../_components/AhaPuzzle";

type Difficulty = "easy" | "normal" | "hard";

export default function MyAhaPlayPage() {
  const sp = useSearchParams();
  const id = sp.get("id");

  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [seed, setSeed] = useState(0);

  const [src, setSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // IndexedDBから Blob→objectURL を生成して表示
  useEffect(() => {
    let alive = true;
    let urlToRevoke: string | null = null;

    (async () => {
      setLoading(true);
      setSrc(null);

      if (!id) {
        setLoading(false);
        return;
      }

      const url = await getUserImageSrcById(id);
      if (!alive) {
        if (url) revokeUrl(url);
        return;
      }

      urlToRevoke = url;
      setSrc(url ?? null);
      setLoading(false);
    })();

    return () => {
      alive = false;
      if (urlToRevoke) revokeUrl(urlToRevoke);
    };
  }, [id]);

  const imageKey = useMemo(() => {
    return `my_${id}_${seed}`;
  }, [id, seed]);

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-950 text-white">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            読み込み中…
          </div>
        </div>
      </main>
    );
  }

  if (!src) {
    return (
      <main className="min-h-screen bg-neutral-950 text-white">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            画像が見つかりません。
            <Link href="/ahatouch/my" className="ml-2 underline">
              戻る
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-2">
            <Link
              href="/ahatouch/my"
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
            >
              ← 写真選択へ
            </Link>
            <Link
              href="/ahatouch"
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
            >
              AHA TOUCH HOME
            </Link>
          </div>

          <button
            onClick={() => setSeed((n) => n + 1)}
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
          >
            シャッフル
          </button>
        </div>

        <div className="mb-3 flex gap-2">
          {(["easy", "normal", "hard"] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={[
                "rounded-xl border px-4 py-2 text-sm transition",
                difficulty === d
                  ? "border-white/40 bg-white/15"
                  : "border-white/15 bg-white/5 hover:bg-white/10",
              ].join(" ")}
            >
              {d === "easy" ? "やさしい" : d === "normal" ? "ふつう" : "上級"}
            </button>
          ))}
        </div>

        <AhaPuzzle
          imageSrc={src}
          imageKey={imageKey}
          initialDifficulty={difficulty}
        />
      </div>
    </main>
  );
}
