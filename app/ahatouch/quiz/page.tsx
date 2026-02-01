"use client";

import Link from "next/link";
import React, { useMemo, useState } from "react";
import { getCategory } from "../_components/Categories";

const QUIZ_COLS = 10;
const QUIZ_ROWS = 10;
const QUIZ_TILE_COUNT = QUIZ_COLS * QUIZ_ROWS;

// 効果音（任意：public/sounds/ に置く）
const SFX_OPEN = "/sounds/open.mp3";
const SFX_RESET = "/sounds/reset.mp3";
const SFX_CLEAR = "/sounds/clear.mp3";

const playSfx = (src: string, volume = 0.65) => {
  try {
    const a = new Audio(src);
    a.volume = volume;
    a.currentTime = 0;
    void a.play();
  } catch {}
};

const tileClass = (opened: boolean) =>
  [
    "absolute",
    "transition-all duration-200 ease-out",
    "border border-white/25",
    "shadow-[0_0_0_1px_rgba(0,0,0,0.25)]",
    "active:scale-98",
    opened ? "opacity-0 pointer-events-none" : "opacity-100 bg-black",
  ].join(" ");

function useQueryParam(name: string) {
  const [value, setValue] = useState<string | null>(null);
  React.useEffect(() => {
    const url = new URL(window.location.href);
    setValue(url.searchParams.get(name));
  }, [name]);
  return value;
}

export default function AhaQuizPage() {
  const catId = useQueryParam("cat");
  const cat = useMemo(() => getCategory(catId), [catId]);

  const [opened, setOpened] = useState<boolean[]>(
    Array.from({ length: QUIZ_TILE_COUNT }, () => false)
  );

  const openedCount = useMemo(() => opened.filter(Boolean).length, [opened]);
  const allOpened = openedCount === QUIZ_TILE_COUNT;

  const openTile = (i: number) => {
    setOpened((prev) => {
      if (prev[i]) return prev;
      const next = [...prev];
      next[i] = true;
      return next;
    });
    playSfx(SFX_OPEN, 0.7);
  };

  const reset = () => {
    setOpened(Array.from({ length: QUIZ_TILE_COUNT }, () => false));
    playSfx(SFX_RESET, 0.6);
  };

  const openAll = () => {
    setOpened(Array.from({ length: QUIZ_TILE_COUNT }, () => true));
    playSfx(SFX_CLEAR, 0.7);
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto max-w-5xl px-4 pt-6 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">ちらりずむ（{cat.label}）</h1>
            <p className="mt-1 text-sm opacity-80">100枚めくり</p>
          </div>

          <div className="text-right text-sm opacity-80">
            {openedCount}/{QUIZ_TILE_COUNT}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/ahatouch/chirarizumu"
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
          >
            カテゴリへ戻る
          </Link>

          <button
            onClick={reset}
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
          >
            リセット
          </button>

          <button
            onClick={openAll}
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
          >
            全開
          </button>

          <Link
            href="/workspace"
            className="ml-auto rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
          >
            WORK SPACEへ
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 pb-10">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="relative w-full overflow-hidden rounded-xl border border-white/10">
            <img
              src={cat.imageSrc}
              alt={cat.label}
              className="block w-full h-auto select-none"
              draggable={false}
            />

            <div className="absolute inset-0">
              {opened.map((isOpened, i) => {
                const col = i % QUIZ_COLS;
                const row = Math.floor(i / QUIZ_COLS);

                const w = 100 / QUIZ_COLS;
                const h = 100 / QUIZ_ROWS;
                const x = col * w;
                const y = row * h;

                return (
                  <button
                    key={i}
                    type="button"
                    className={tileClass(isOpened)}
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      width: `${w}%`,
                      height: `${h}%`,
                    }}
                    onClick={() => openTile(i)}
                    aria-label={`tile-${i}`}
                  />
                );
              })}

              {allOpened && (
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <div className="rounded-xl border border-white/15 bg-black/70 px-4 py-2 text-center text-sm">
                    ぜんぶ見えた！
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 text-xs opacity-70">
            カテゴリ: <code className="opacity-90">{cat.id}</code> / 画像:{" "}
            <code className="opacity-90">public{cat.imageSrc}</code>
          </div>
        </div>
      </div>
    </main>
  );
}
