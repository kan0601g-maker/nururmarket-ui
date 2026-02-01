"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  listChirarizumuImages,
  getChirarizumuImagesSrcById,
  type ChirarizumuImage,
} from "../_components/chirarizumuImages";

export default function ChirarizumuHomePage() {
  // 🔴 StoredImage ではなく ChirarizumuImage
  const [images, setImages] = useState<ChirarizumuImage[]>([]);
  const [thumbs, setThumbs] = useState<Record<string, string>>({});
  const [loadingThumbs, setLoadingThumbs] = useState(false);

  // 初期一覧（static 定義）
  useEffect(() => {
    setImages(listChirarizumuImages());
  }, []);

  // サムネ生成（public 配下の URL）
  useEffect(() => {
    let alive = true;
    setThumbs({});

    (async () => {
      if (!images.length) return;

      setLoadingThumbs(true);
      const next: Record<string, string> = {};

      for (const img of images) {
        const url = getChirarizumuImagesSrcById(img.id);
        if (!alive) return;
        next[img.id] = url;
      }

      if (!alive) return;
      setThumbs(next);
      setLoadingThumbs(false);
    })();

    return () => {
      alive = false;
    };
  }, [images]);

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

        {loadingThumbs && (
          <div className="mt-4 text-xs opacity-70">サムネ生成中…</div>
        )}

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {grid.map((img) => {
            const url = thumbs[img.id];

            return (
              <Link
                key={img.id}
                href={`/ahatouch/chirarizumu/play?id=${img.id}`}
                className="group rounded-2xl border border-white/10 bg-white/5 p-3 hover:bg-white/10 transition"
              >
                <div className="overflow-hidden rounded-xl border border-white/10">
                  {url ? (
                    <img
                      src={url}
                      alt={img.id}
                      className="h-44 w-full object-cover opacity-90 group-hover:opacity-100 transition"
                      draggable={false}
                    />
                  ) : (
                    <div className="h-44 w-full bg-black/20 flex items-center justify-center text-xs opacity-70">
                      読み込み中…
                    </div>
                  )}
                </div>
                <div className="mt-2 text-sm opacity-80">{img.id}</div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
