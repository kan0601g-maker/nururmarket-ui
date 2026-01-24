// app/workspace/page.tsx
export default function WorkspacePage() {
  const apps = [
    {
      s: "starleaf",
      t: "Starleaf",
      d: "構想・設計・思考を育てるメインアプリ。",
      live: true,
    },
    { s: "dev-1", t: "開発中①", d: "新しいアプリを準備中。", live: false },
    { s: "dev-2", t: "開発中②", d: "新しいアプリを準備中。", live: false },
    { s: "dev-3", t: "開発中③", d: "新しいアプリを準備中。", live: false },
    { s: "dev-4", t: "開発中④", d: "新しいアプリを準備中。", live: false },
    { s: "dev-5", t: "開発中⑤", d: "新しいアプリを準備中。", live: false },
    { s: "dev-6", t: "開発中⑥", d: "新しいアプリを準備中。", live: false },
    { s: "dev-7", t: "開発中⑦", d: "新しいアプリを準備中。", live: false },
  ];

  return (
    <main className="min-h-screen bg-green-50 text-zinc-900">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="font-semibold tracking-tight">ヌルマーケット</div>
          <a
            href="/"
            className="text-sm text-zinc-600 hover:text-zinc-900 hover:underline"
          >
            ← HOMEへ戻る
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          WORK SPACE
        </h1>
        <p className="mt-4 max-w-2xl text-zinc-600">
          内部アプリの起動と管理。<br />
          売り場（NURU MARKET）とは切り離された作業空間。
        </p>
      </section>

      {/* Apps Grid */}
      <section className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-2">
        {apps.map((x) =>
          x.live ? (
            <a
              key={x.s}
              href={`/${x.s}`}
              className="block rounded-xl border bg-white p-6 hover:shadow-sm"
            >
              <div className="text-lg font-semibold">{x.t}</div>
              <p className="mt-2 text-sm text-zinc-600">{x.d}</p>
            </a>
          ) : (
            <div
              key={x.s}
              className="block rounded-xl border bg-white/60 p-6 text-zinc-500"
            >
              <div className="text-lg font-semibold">{x.t}</div>
              <p className="mt-2 text-sm">{x.d}</p>
              <div className="mt-3 text-xs">coming soon</div>
            </div>
          )
        )}
      </section>

      {/* Footer */}
      <footer className="mx-auto mt-20 max-w-6xl border-t px-6 py-10 text-sm text-zinc-500">
        © ヌルマーケット — workspace
      </footer>
    </main>
  );
}
