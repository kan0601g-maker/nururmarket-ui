// app/market/[slug]/page.tsx
export default async function DetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

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

      {/* Content */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-6">
        <div className="grid gap-6 md:grid-cols-5">
          {/* Left: media + description */}
          <div className="space-y-6 md:col-span-3">
            <div className="aspect-[16/10] w-full rounded-2xl border bg-white" />

            <div className="rounded-2xl border bg-white p-6">
              <div className="text-sm font-semibold">Description</div>
              <p className="mt-3 text-sm leading-7 text-zinc-700">
                これは詳細ページの完成像テンプレ。<span className="font-mono">{slug}</span> のダミー内容。
                左はメディアと本文、右はタイトル・タグ・行動を固定して迷いを消す。
              </p>

              <div className="mt-4 rounded-xl border bg-rose-50 p-4 text-sm text-zinc-700">
                ここに仕様、背景、制作ログなどの長文が入っても読みやすい器。
              </div>
            </div>
          </div>

          {/* Right: action panel */}
          <div className="space-y-6 md:col-span-2">
            <div className="rounded-2xl border bg-white p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-semibold">Item Title</div>
                  <div className="mt-1 text-xs text-zinc-500">Room / Tag • Status</div>
                </div>
                <span className="rounded-full border px-2 py-0.5 text-[11px] text-zinc-600">
                  Live
                </span>
              </div>

              <div className="mt-5 flex gap-2">
                <button className="w-full rounded-full bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800">
                  Save
                </button>
                <button className="w-full rounded-full border bg-white px-4 py-2 text-sm hover:bg-zinc-50">
                  Add
                </button>
              </div>

              <div className="mt-4 text-sm text-zinc-600">
                行動を先に。読む前に保存できる設計。
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-6">
              <div className="text-sm font-semibold">Meta</div>
              <ul className="mt-3 space-y-2 text-sm text-zinc-700">
                <li>・最終更新：—</li>
                <li>・タグ：—</li>
                <li>・関連：—</li>
              </ul>
            </div>

            <div className="rounded-2xl border bg-white p-6">
              <div className="text-sm font-semibold">Related</div>
              <div className="mt-3 space-y-3">
                {[
                  { s: "pwa-mother", t: "壊れないPWA母体", m: "Build / Design" },
                  { s: "portafortuna-stack", t: "Portafortuna STACK", m: "Leather / Wallet" },
                  { s: "beta-alanine-note", t: "β-アラニン 調査ノート", m: "Lab / Report" },
                ].map((x) => (
                  <a
                    key={x.s}
                    href={`/market/${x.s}`}
                    className="block rounded-xl border bg-white p-4 hover:bg-zinc-50"
                  >
                    <div className="font-semibold">{x.t}</div>
                    <div className="mt-1 text-xs text-zinc-500">{x.m}</div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto mt-6 max-w-6xl border-t px-6 py-10 text-sm text-zinc-500">
        © NURU MARKET — detail
      </footer>
    </main>
  );
}
