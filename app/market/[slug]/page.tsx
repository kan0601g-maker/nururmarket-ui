// app/market/[slug]/page.tsx
import AppHeader from "../../components/AppHeader";

export default function MarketItemPage() {
  return (
    <main className="min-h-screen bg-pink-50 text-zinc-900">
      {/* Header（スクショの上帯：中央タイトル + 右側リンク1つ） */}
      <AppHeader
        leftTitle="NURU MARKET"
        rightLink={{ href: "/market", label: "Market" }}
      />

      {/* 旧 navLinks の3つは、ページ側でボタンとして出す（AppHeaderをいじらず最短でビルド通す） */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <a
            href="/market"
            className="inline-block text-sm text-zinc-700 hover:underline"
          >
            ← Marketへ戻る
          </a>

          <div className="flex flex-wrap gap-2">
            <a
              href="/market"
              className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
            >
              Market
            </a>
            <a
              href="/rooms"
              className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
            >
              Rooms
            </a>
            <a
              href="/wallet"
              className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
            >
              Wallet
            </a>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* LEFT */}
          <div className="space-y-6">
            {/* Media */}
            <div className="rounded-2xl border border-zinc-300 bg-white p-6">
              <div className="aspect-[16/10] w-full rounded-xl border border-zinc-300 bg-zinc-50" />
            </div>

            {/* Description */}
            <div className="rounded-2xl border border-zinc-300 bg-white p-6">
              <h3 className="text-sm font-semibold text-zinc-900">
                Description
              </h3>
              <p className="mt-3 text-sm leading-6 text-zinc-700">
                これは詳細ページの完成形テンプレ。のダミー内容。左はメディアと本文、
                右はタイトル・タグ・行動（Save/Add）を固定して迷いを減らす。
              </p>

              <div className="mt-4 rounded-xl border border-zinc-300 bg-pink-50 p-4 text-sm text-zinc-700">
                ここに「ストーリー」「仕様」「制作ログ」など、長文が入っても読みやすい器。
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            {/* Item card */}
            <div className="rounded-2xl border border-zinc-300 bg-white p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">Item Title</h2>
                  <div className="mt-1 text-xs text-zinc-500">
                    Room / Tag ・Status
                  </div>
                </div>
                <span className="rounded-full border border-zinc-300 px-2 py-0.5 text-xs text-zinc-700">
                  Live
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <button className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800">
                  Save
                </button>
                <button className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50">
                  Add
                </button>
              </div>

              <p className="mt-4 text-xs text-zinc-600">
                右は「行動」を先に置く。読む前に保存できる。
              </p>
            </div>

            {/* Meta */}
            <div className="rounded-2xl border border-zinc-300 bg-white p-6">
              <h3 className="text-sm font-semibold">Meta</h3>
              <ul className="mt-3 space-y-2 text-sm text-zinc-700">
                <li>・最終更新：—</li>
                <li>・タグ：—</li>
                <li>・関連Room：—</li>
              </ul>
            </div>

            {/* Related */}
            <div className="rounded-2xl border border-zinc-300 bg-white p-6">
              <h3 className="text-sm font-semibold">Related</h3>

              <div className="mt-4 space-y-3">
                <a
                  href="/market/portfolio"
                  className="block rounded-xl border border-zinc-300 bg-white p-4 hover:bg-zinc-50"
                >
                  <div className="text-sm font-semibold">壊れないPWA母体</div>
                  <div className="mt-1 text-xs text-zinc-500">Build / Design</div>
                </a>

                <a
                  href="/market/portafortuna-stack"
                  className="block rounded-xl border border-zinc-300 bg-white p-4 hover:bg-zinc-50"
                >
                  <div className="text-sm font-semibold">Portafortuna STACK</div>
                  <div className="mt-1 text-xs text-zinc-500">Leather / Wallet</div>
                </a>

                <a
                  href="/market/beta-alanine-note"
                  className="block rounded-xl border border-zinc-300 bg-white p-4 hover:bg-zinc-50"
                >
                  <div className="text-sm font-semibold">β-アラニン調査ノート</div>
                  <div className="mt-1 text-xs text-zinc-500">Lab / Report</div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
