// app/market/page.tsx
export default function MarketPage() {
  const items = [
    { slug: "portafortuna-stack", t: "Portafortuna STACK", m: "Leather / Wallet", b: "Featured" },
    { slug: "beta-alanine-note", t: "β-アラニン 調査ノート", m: "Lab / Report", b: "Draft" },
    { slug: "garlic-white-rokken", t: "にんにく計画 White Rokken", m: "Grow / Plan", b: "Live" },
    { slug: "pwa-mother", t: "壊れないPWA母体", m: "Build / Design", b: "Live" },
    { slug: "another13-memo", t: "Another 13 memo", m: "Scent / Memo", b: "Draft" },
    { slug: "nisa-watch", t: "NISA 監視リスト", m: "Money / List", b: "Live" },
  ];

  return (
    <main className="min-h-screen bg-rose-50 text-zinc-900">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center px-6">
          <div className="font-semibold tracking-tight">NURU MARKET</div>
        </div>
      </header>

      {/* Back to HOME */}
      <section className="mx-auto max-w-6xl px-6 pt-6">
        <a
          href="/"
          className="text-sm text-zinc-600 hover:text-zinc-900 hover:underline"
        >
          ← HOMEへ戻る
        </a>
      </section>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-16 text-center">
        <div className="mb-3 text-5xl leading-none">👑</div>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Market
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-zinc-600">
          並べる・探す・見せる。<br />
          NURU MARKET の売り場。
        </p>
      </section>

      {/* Toolbar */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full items-center gap-2 rounded-full border bg-white px-4 py-2 md:max-w-md">
            <span className="text-xs text-zinc-500">Search</span>
            <input
              className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
              placeholder="search..."
            />
          </div>

          <div className="flex gap-2">
            <button className="rounded-full bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800">
              Sort
            </button>
            <button className="rounded-full bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800">
              Filter
            </button>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto mt-8 grid max-w-6xl gap-6 px-6 md:grid-cols-3">
        {items.map((x) => (
          <a
            key={x.slug}
            href={`/market/${x.slug}`}
            className="block rounded-xl border bg-white p-6 hover:shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold">{x.t}</div>
                <div className="mt-1 text-xs text-zinc-500">{x.m}</div>
              </div>
              <span className="rounded-full border px-2 py-0.5 text-[11px] text-zinc-600">
                {x.b}
              </span>
            </div>
            <p className="mt-3 text-sm text-zinc-600">
              ダミーコンテンツ。クリックで詳細へ。
            </p>
          </a>
        ))}
      </section>

      {/* Footer */}
      <footer className="mx-auto mt-20 max-w-6xl border-t px-6 py-10 text-sm text-zinc-500">
        © NURU MARKET — market
      </footer>
    </main>
  );
}
