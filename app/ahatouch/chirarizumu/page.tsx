"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  listChirarizumuImages,
  getChirarizumuImagesSrcById,
  revokeUrl,
  type StoredImage,
  type ChirarizumuImage,
} from "../_components/chirarizumuImages";

export default function ChirarizumuHomePage() {
  // マスタ（id, category）
  const [baseImages, setBaseImages] = useState<ChirarizumuImage[]>([]);

  // 表示用（id, url）
  const [images, setImages] = useState<StoredImage[]>([]);
  const [loading, setLoading] = useState(false);

  // 初期ロード：マスタだけ読む
  useEffect(() => {
    setBaseImages(listChirarizumuImages());
  }, []);

  // マスタ → 表示用に変換
  useEffect(() => {
    let alive = true;

    // 既存URL破棄
    images.forEach((i) => revokeUrl(i.url));
    setImages([]);

    (async () => {
      if (!baseImages.length) return;

      setLoading(true);

      const next: StoredImage[] = [];

      for (const img of baseImages) {
        const url = getChirarizumuImagesSrcById(img.id);
        if (!alive) {
          revokeUrl(url);
          return;
        }
        next.push({ id: img.id, url });
      }

      if (!alive) {
        next.forEach((i) => revokeUrl(i.url));
        return;
      }

      setImages(next);
      setLoading(false);
    })();

    return () => {
      alive = false;
      images.forEach((i) => revokeUrl(i.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseImages]);

  const grid = useMemo(() => images, [images]);

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">みんなでチラリズム</h1>
            <p className="mt-1 text-sm opacity-70">順番にめくって楽しもう</p>
          </div>

          <Link
            href="/ahatouch"
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
          >
            AHA TOUCH HOME
          </Link>
        </div>

        {loading && (
          <div className="mt-4 text-xs opacity-70">読み込み中…</div>
        )}

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {grid.map((img) => (
            <Link
              key={img.id}
              href={`/ahatouch/chirarizumu/play?id=${img.id}`}
              className="group rounded-2xl border border-white/10 bg-white/5 p-3 hover:bg-white/10 transition"
            >
              <div className="overflow-hidden rounded-xl border border-white/10">
                <img
                  src={img.url}
                  alt={img.id}
                  className="h-44 w-full object-cover opacity-90 group-hover:opacity-100 transition"
                  draggable={false}
                />
              </div>
              <div className="mt-2 text-sm opacity-80">{img.id}</div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
