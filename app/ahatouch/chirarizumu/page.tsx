"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import {
  addChirarizumuImages,
  clearChirarizumuImages,
  listStoredChirarizumuImages,
  getChirarizumuImageSrcById,
  revokeUrl,
  type StoredImage,
} from "../_components/chirarizumuImages";

export default function ChirarizumuHomePage() {
  const [images, setImages] = useState<StoredImage[]>([]);
  const [thumbs, setThumbs] = useState<Record<string, string>>({});
  const [loadingThumbs, setLoadingThumbs] = useState(false);

  useEffect(() => {
    setImages(listStoredChirarizumuImages());
  }, []);

  // サムネ生成
  useEffect(() => {
    let alive = true;

    Object.values(thumbs).forEach((u) => revokeUrl(u));
    setThumbs({});

    (async () => {
      if (!images.length) return;

      setLoadingThumbs(true);

      const next: Record<string, string> = {};
      for (const img of images) {
        const url = await getChirarizumuImageSrcById(img.id);
        if (!alive) {
          if (url) revokeUrl(url);
          continue;
        }
        if (url) next[img.id] = url;
      }

      if (!alive) {
        Object.values(next).forEach((u) => revokeUrl(u));
        return;
      }

      setThumbs(next);
      setLoadingThumbs(false);
    })();

    return () => {
      alive = false;
      Object.values(thumbs).forEach((u) => revokeUrl(u));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  const onPick = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    await addChirarizumuImages(files);
    setImages(listStoredChirarizumuImages());
    e.target.value = "";
  };

  const clearAll = async () => {
    await clearChirarizumuImages();
    Object.values(thumbs).forEach((u) => revokeUrl(u));
    setThumbs({});
    setImages([]);
  };

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
          <label className="text-sm font-semibold">
            写真を追加（チラリズム専用）
          </label>
          <div className="mt-2">
            <input type="file" accept="image/*" multiple onChange={onPick} />
          </div>

          <button
            onClick={clearAll}
            className="mt-3 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
          >
            全削除
          </button>

          {loadingThumbs && (
            <div className="mt-2 text-xs opacity-70">サムネ生成中…</div>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {grid.map((img) => {
            const url = thumbs[img.id] ?? null;
            const label = img.name ?? "image";

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
                      alt={label}
                      className="h-44 w-full object-cover opacity-90 group-hover:opacity-100 transition"
                      draggable={false}
                    />
                  ) : (
                    <div className="h-44 w-full bg-black/20 flex items-center justify-center text-xs opacity-70">
                      読み込み中…
                    </div>
                  )}
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
