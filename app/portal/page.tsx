"use client";

import Link from "next/link";

type Item = {
  title: string;
  desc: string;
  href: string;
};

export default function NuruPortalPage() {
  const items: Item[] = [
    {
      title: "AHA TOUCH",
      desc: "ちらりずむ / パズル / じぶんだけ",
      href: "/ahatouch",
    },
    {
      title: "Starleaf",
      desc: "ゲーム（作業中）",
      href: "/starleaf",
    },
    {
      title: "NURU Market Place",
      desc: "売り場（仮）",
      href: "/place",
    },
  ];

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">NURU PORTAL</h1>
            <p className="mt-2 text-sm opacity-80">アプリを選ぶ（裏口）</p>
          </div>

          <Link
            href="/ahatouch"
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
          >
            AHA TOUCH
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition"
            >
              <div className="text-xl font-bold">{it.title}</div>
              <div className="mt-2 text-sm opacity-80">{it.desc}</div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-xs opacity-60">
          ※ここは裏口。表側は /place（後で復元）
        </div>
      </div>
    </main>
  );
}
