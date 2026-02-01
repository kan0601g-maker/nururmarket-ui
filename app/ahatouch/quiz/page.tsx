// app/ahatouch/quiz/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AHA_CATEGORIES, getCategory } from "../_components/Categories";
import {
  listImagesByCategory,
  pickRandom,
  type AhaImage,
} from "../_components/getImages";

type Card = {
  id: string;
  label: string;
  sub: string;
  href: string;
  imageSrc: string;
};

export default function AhaQuizHomePage() {
  const sp = useSearchParams();
  const catParam = sp.get("cat");

  // ✅ cat は必ず存在するようにする（null 撲滅）
  const catObj =
    (catParam ? getCategory(catParam) : null) ?? AHA_CATEGORIES[0];

  const catId = catObj.id;
  const title = catObj.label ?? "カテゴリ";

  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    // クライアントのみで生成（SSRズレ防止）
    const all = listImagesByCategory(catId);
    const picked = pickRandom(all, 6);

    const next: Card[] = picked.map((img: AhaImage) => ({
      id: img.id,
      label: title,
      sub: "クイズ",
      href: `/ahatouch/quiz/play?id=${encodeURIComponent(img.id)}`,
      imageSrc: img.src,
    }));

    setCards(next);
  }, [catId, title]);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">ちらりずむ（{title}）</h1>
            <p className="mt-1 text-sm opacity-80">100枚めくり</p>
          </div>

          <Link
            href="/ahatouch"
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
          >
            AHA TOUCH HOME
          </Link>
        </div>

        {/* カテゴリ切り替え */}
        <div className="mt-6 flex flex-wrap gap-2">
          {AHA_CATEGORIES.map((c) => {
            const active = c.id === catId;
            return (
              <Link
                key={c.id}
                href={`/ahatouch/quiz?cat=${c.id}`}
                className={[
                  "rounded-xl px-4 py-2 text-sm border transition",
                  active
                    ? "bg-white text-black border-white"
                    : "bg-white/5 text-white border-white/15 hover:bg-white/10",
                ].join(" ")}
              >
                {c.label}
              </Link>
            );
          })}
        </div>

        {/* カード一覧 */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {cards.length === 0 ? (
            // スケルトン
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-[220px] rounded-2xl border border-white/10 bg-white/5 animate-pulse"
              />
            ))
          ) : (
            cards.map((card) => (
              <Link
                key={card.id}
                href={card.href}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={card.imageSrc}
                    alt={card.label}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    draggable={false}
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <div className="text-lg font-semibold drop-shadow">
                      {card.label}
                    </div>
                    <div className="text-sm opacity-80">{card.sub}</div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
