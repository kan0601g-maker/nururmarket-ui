"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  addUserImages,
  clearUserImages,
  listUserImages,
  getUserImageSrcById,
  revokeUrl,
  type StoredImage,
} from "../_components/userImages";

function ThumbImg({ id, name }: { id: string; name: string }) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    let urlToRevoke: string | null = null;

    (async () => {
      setUrl(null);
      const u = await getUserImageSrcById(id);
      if (!alive) {
        if (u) revokeUrl(u);
        return;
      }
      urlToRevoke = u;
      setUrl(u ?? null);
    })();

    return () => {
      alive = false;
      if (urlToRevoke) revokeUrl(urlToRevoke);
    };
  }, [id]);

  if (!url) {
    return (
      <div className="h-44 w-full bg-black/20 flex items-center justify-center text-xs opacity-70">
        読み込み中…
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={name}
      className="h-44 w-full object-cover opacity-90 group-hover:opacity-100 transition"
      draggable={false}
    />
  );
}

export default function MyAhaHomePage() {
  const [images, setImages] = useState<StoredImage[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setImages(listUserImages());
  }, []);

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setBusy(true);
    try {
      await addUserImages(files);
      setImages(listUserImages());
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  };

  const clearAll = async () => {
    setBusy(true);
    try {
      await clearUserImages();
      setImages([]);
    } finally {
      setBusy(false);
    }
  };

  const grid = useMemo(() => images, [images]);

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">自分だけのAHA パズル</h1>
            <p className="mt-1 text-sm opacity-70">写真を選んで遊ぶ</p>
          </div>

          <Link
            href="/ahatouch"
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
          >
            AHA TOUCH HOME
          </Link>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <label className="text-sm font-semibold">写真を追加</label>
          <div className="mt-2">
            <input type="file" accept="image/*" multiple onChange={onPick} />
          </div>

          <button
            onClick={clearAll}
            disabled={busy}
            className="mt-3 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition disabled:opacity-50"
          >
            全削除
          </button>

          {busy ? (
            <div className="mt-2 text-xs opacity-70">処理中…</div>
          ) : null}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {grid.map((img) => (
            <Link
              key={img.id}
              href={`/ahatouch/my/play?id=${img.id}`}
              className="group rounded-2xl border border-white/10 bg-white/5 p-3 hover:bg-white/10 transition"
            >
              <div className="overflow-hidden rounded-xl border border-white/10">
                <ThumbImg id={img.id} name={img.name} />
              </div>
              <div className="mt-2 text-sm opacity-80">{img.name}</div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
