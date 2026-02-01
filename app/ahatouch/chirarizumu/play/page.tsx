"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import {
  listChirarizumuImages,
  getChirarizumuImageSrcById,
  revokeUrl,
  type ChirarizumuImage,
} from "../../_components/chirarizumuImages";

/**
 * ✅ useSearchParams を使う処理は必ず Suspense の内側へ
 */
function PlayInner() {
  const sp = useSearchParams();

  // ✅ ここで query を読む（Suspense の内側だからビルドが通る）
  const idFromQuery = sp.get("id") ?? "";

  // ---- ここから「元の play の中身」を入れる ----
  const [ready, setReady] = useState(false);

  const [images, setImages] = useState<ChirarizumuImage[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [srcMap, setSrcMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // 一覧セット（静的）
  useEffect(() => {
    const list = listChirarizumuImages();
    setImages(list);

    const picked = idFromQuery || list[0]?.id || "";
    setSelectedId(picked);

    setReady(true);
  }, [idFromQuery]);

  // 画像URL（サムネ/表示用）生成（storedも静的も両対応）
  useEffect(() => {
    let alive = true;

    // 既存破棄（objectURLが混ざる可能性があるので）
    Object.values(srcMap).forEach((u) => revokeUrl(u));

    (async () => {
      if (!images.length) return;

      setLoading(true);
      const next: Record<string, string> = {};

      for (const img of images) {
        const url = await getChirarizumuImageSrcById(img.id);
        if (!alive) {
          if (url) revokeUrl(url);
          return;
        }
        if (url) next[img.id] = url;
      }

      if (!alive) {
        Object.values(next).forEach((u) => revokeUrl(u));
        return;
      }

      setSrcMap(next);
      setLoading(false);
    })();

    return () => {
      alive = false;
      Object.values(srcMap).forEach((u) => revokeUrl(u));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  const currentIndex = useMemo(() => {
    if (!selectedId) return 0;
    const i = images.findIndex((x) => x.id === selectedId);
    return i >= 0 ? i : 0;
  }, [images, selectedId]);

  const current = images[currentIndex] ?? null;
  const currentSrc = current ? srcMap[current.id] ?? "" : "";

  const goPrev = () => {
    if (!images.length) return;
    const nextIndex = (currentIndex - 1 + images.length) % images.length;
    setSelectedId(images[nextIndex].id);
  };

  const goNext = () => {
    if (!images.length) return;
    const nextIndex = (currentIndex + 1) % images.length;
    setSelectedId(images[nextIndex].id);
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">チラリズム PLAY</h1>
            <p className="mt-1 text-sm opacity-70">
              id: {idFromQuery || "(none)"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/ahatouch/chirarizumu"
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
          {!ready ? (
            <div className="text-sm opacity-70">読み込み中…</div>
          ) : (
            <>
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm opacity-80">
                  {images.length ? `${currentIndex + 1} / ${images.length}` : "0 / 0"}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={goPrev}
                    className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
                    disabled={!images.length}
                  >
                    ← 前
                  </button>
                  <button
                    onClick={goNext}
                    className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
                    disabled={!images.length}
                  >
                    次 →
                  </button>
                </div>
              </div>

              <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                {loading && !currentSrc ? (
                  <div className="flex h-[420px] items-center justify-center text-xs opacity-70">
                    読み込み中…
                  </div>
                ) : currentSrc ? (
                  <img
                    src={currentSrc}
                    alt={current ? current.title ?? current.id : "image"}
                    className="block h-[420px] w-full object-contain"
                    draggable={false}
                  />
                ) : (
                  <div className="flex h-[420px] items-center justify-center text-xs opacity-70">
                    画像がありません
                  </div>
                )}
              </div>

              {/* 下サムネ（任意） */}
              <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-6">
                {images.slice(0, 24).map((img) => {
                  const u = srcMap[img.id] ?? "";
                  const active = img.id === selectedId;
                  return (
                    <button
                      key={img.id}
                      onClick={() => setSelectedId(img.id)}
                      className={[
                        "rounded-xl border p-2 transition",
                        active
                          ? "border-white/40 bg-white/10"
                          : "border-white/10 bg-white/5 hover:bg-white/10",
                      ].join(" ")}
                    >
                      <div className="overflow-hidden rounded-lg bg-black/20">
                        {u ? (
                          <img
                            src={u}
                            alt={img.title ?? img.id}
                            className="h-16 w-full object-cover opacity-90"
                            draggable={false}
                          />
                        ) : (
                          <div className="h-16 w-full" />
                        )}
                      </div>
                      <div className="mt-1 truncate text-[10px] opacity-70">
                        {img.title ?? img.id}
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

/**
 * ✅ default export は Suspense で包むだけ（これがビルド通す本体）
 */
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

