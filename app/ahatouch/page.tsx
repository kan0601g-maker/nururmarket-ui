"use client";

import Link from "next/link";

export default function AhaTouchHomePage() {
  const tiles = [
    {
      title: "AHA TOUCH パズル",
      desc: "入れ替えて完成させる",
      href: "/ahatouch/puzzle",
    },
    {
      title: "自分だけのAHA パズル",
      desc: "自分の写真でパズル",
      href: "/ahatouch/my",
    },
    {
      title: "みんなでチラリズム",
      desc: "チラ見せで気づく",
      href: "/ahatouch/chirarizumu",
    },
  ];

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">AHA TOUCH</h1>

            {/* ★ HOMEの最初の一文（確定） */}
            <p className="mt-2 text-sm opacity-80">
              あそぶ？ それとも、つくる？✨
            </p>
          </div>

          <Link
            href="/"
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
          >
            NURU PORTAL
          </Link>
        </div>

        {/* ★ 2択ボタン（あそぶ／つくる） */}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/ahatouch/chirarizumu"
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
          >
            あそぶ
          </Link>

          <Link
            href="/ahatouch/my"
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
          >
            つくる
          </Link>
        </div>

        {/* ★ 既存タイル（詳細選択用） */}
        <div className="mt-8 space-y-4">
          {tiles.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="block rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition"
            >
              <div className="text-xl font-bold">{t.title}</div>
              <div className="mt-2 text-sm opacity-80">{t.desc}</div>
            </Link>
          ))}
        </div>

        <ul className="mt-8 text-xs opacity-60 list-disc pl-5 space-y-1">
          <li>ここでは遊び方だけを選びます</li>
          <li>むずかしさやカテゴリは次の画面で選択します</li>
        </ul>
      </div>
    </main>
  );
}
