// app/page.tsx
"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";

type PortalTile = {
  title: string;
  desc: string;
  href: string;
  badge?: string; // 例: "NEW" / "開発中"
};

const PORTAL_TILES: PortalTile[] = [
  { title: "STARLEAF", desc: "超大作：世界観・経済圏・物語の母体。", href: "/starleaf" },
  { title: "AHA TOUCH", desc: "直感×反復：ちらりずむ / パズル / 自分だけ。", href: "/ahatouch", badge: "LIVE" },

  // 予定枠（あとで差し替え）
  { title: "家計簿", desc: "レシート / バーコード読み込み（予定）。", href: "/rooms", badge: "予定" },
  { title: "AHA BLOCK", desc: "英語×テトリス（予定）。", href: "/rooms", badge: "予定" },

  { title: "Board", desc: "掲示板：メモ・同期・共有用。", href: "/rooms", badge: "開発中" },
  { title: "Logs", desc: "運用・履歴・日々の記録。", href: "/rooms", badge: "開発中" },
  { title: "Settings", desc: "アカウント・母艦の設定。", href: "/rooms", badge: "開発中" },
];

function TabButton({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={[
        "rounded-xl px-4 py-2 text-sm transition border",
        active
          ? "bg-pink-500 text-white border-pink-400 shadow-sm"
          : "bg-white text-zinc-700 border-pink-200 hover:bg-pink-50",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

function MarketPanel() {
  return (
    <section className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-zinc-800">NURU MARKET</h2>
      <p className="mt-2 text-sm text-zinc-500">
        ここはマーケット側（後で復旧・実装）。今は「入口の器」だけ維持。
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-pink-100 bg-[#fff7fb] p-5">
          <div className="text-sm font-semibold text-zinc-800">マーケット（予定）</div>
          <div className="mt-1 text-xs text-zinc-500">取引・出品・NMP等はここに。</div>
        </div>
        <div className="rounded-2xl border border-pink-100 bg-[#fff7fb] p-5">
          <div className="text-sm font-semibold text-zinc-800">お知らせ（予定）</div>
          <div className="mt-1 text-xs text-zinc-500">運用・ルール・アップデート通知。</div>
        </div>
      </div>
    </section>
  );
}

function PortalPanel() {
  return (
    <section className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-zinc-800">NURU PORTAL</h2>
          <p className="mt-2 text-sm text-zinc-500">
            内部アプリの起動と管理。ここだけ見れば迷わない。
          </p>
        </div>

        <Link
          href="/?tab=market"
          className="text-sm text-pink-600 hover:text-pink-700 underline"
        >
          → NURU MARKETへ
        </Link>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {PORTAL_TILES.map((t) => (
          <Link
            key={t.title}
            href={t.href}
            className="group block rounded-2xl border border-pink-100 bg-[#fff7fb] p-6 transition hover:bg-pink-50 hover:border-pink-200"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="text-lg font-semibold tracking-tight text-zinc-800">
                {t.title}
              </div>
              {t.badge ? (
                <span className="rounded-full border border-pink-200 bg-white px-2 py-0.5 text-xs text-pink-700">
                  {t.badge}
                </span>
              ) : null}
            </div>

            <div className="mt-2 text-sm text-zinc-600">{t.desc}</div>

            <div className="mt-5 text-sm font-semibold text-pink-700 group-hover:underline">
              → 開く
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ✅ useSearchParams を使うのは Suspense の「内側」だけ
function HomeInner() {
  const params = useSearchParams();
  const tab = params.get("tab") ?? "market";

  return (
    <main className="min-h-screen bg-[#fff7fb] text-zinc-700">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div>
            <h1 className="text-3xl font-bold text-pink-600">NURU Market Place</h1>
            <p className="mt-2 text-sm text-zinc-500">
              入口はここに固定（迷子防止）。タブで切り替える。
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex gap-2">
          <TabButton href="/?tab=market" active={tab === "market"}>
            NURU MARKET
          </TabButton>
          <TabButton href="/?tab=portal" active={tab === "portal"}>
            NURU PORTAL
          </TabButton>
        </div>

        {/* Body */}
        <div className="mt-8">{tab === "market" ? <MarketPanel /> : <PortalPanel />}</div>

        {/* Footer */}
        <footer className="mt-14 border-t border-pink-100 pt-8 text-xs text-zinc-400">
          © NURU — Market Place
        </footer>
      </div>
    </main>
  );
}

// ✅ ここが本体：Suspense で包むだけ
export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#fff7fb] text-zinc-700 flex items-center justify-center">
          <div className="text-sm opacity-70">読み込み中…</div>
        </main>
      }
    >
      <HomeInner />
    </Suspense>
  );
}
