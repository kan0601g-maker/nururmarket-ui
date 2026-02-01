"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  listChirarizumuImages,
  getChirarizumuImageSrcById,
  type ChirarizumuImage,
} from "../_components/chirarizumuImages";

export default function ChirarizumuHomePage() {
  const [images, setImages] = useState<ChirarizumuImage[]>([]);
  const [loadingThumbs, setLoadingThumbs] = useState(false);

  useEffect(() => {
    setImages(listChirarizumuImages());
  }, []);

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

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm font-semibold">チラリズム（固定画像）</div>
          <div className="mt-1 text-xs opacity-70">
            public/ahatouch/chirarizumu/ 配下の画像を表示しています
          </div>

          {loadingThumbs && (
            <div className="mt-2 text-xs opacity-70">読み込み中…</div>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {grid.map((img) => {
            const src = getChirarizumuImageSrcById(img.id);
            const label = img.title ?? img.id;

            return (
              <Link
                key={img.id}
                href={`/ahatouch/chirarizumu/play?id=${img.id}`}
                className="group rounded-2xl border border-white/10 bg-white/5 p-3 hover:bg-white/10 transition"
              >
                <div className="overflow-hidden rounded-xl border border-white/10">
                  <img
                    src={src}
                    alt={label}
                    className="h-44 w-full object-cover opacity-90 group-hover:opacity-100 transition"
                    draggable={false}
                  />
                </div>
                <div className="mt-2 text-sm opacity-80">{label}</div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
