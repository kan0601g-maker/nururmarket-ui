// app/rooms/page.tsx
export default function RoomsPage() {
  const rooms = [
    { s: "leather", t: "Leather", d: "革・財布・道具。作品と制作ログが同居する棚。" },
    { s: "build", t: "Build", d: "PWA・設計・運用。母体そのものの改善履歴。" },
    { s: "lab", t: "Lab", d: "品質・調査・検証。レポートも資産として扱う。" },
    { s: "grow", t: "Grow", d: "黒文字・にんにく等。計画→記録→成果まで。" },
    { s: "money", t: "Money", d: "投資・判断・監視リスト。思考のログ。" },
    { s: "scent", t: "Scent", d: "香り・生活の整え。短文メモも価値にする。" },
  ];

  return (
    <main className="min-h-screen bg-rose-50 text-zinc-900">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="font-semibold tracking-tight">NURU MARKET</div>
          <nav className="flex items-center gap-6 text-sm text-zinc-700">
            <span className="font-semibold">Market</span>
            <span className="font-semibold">Rooms</span>
            <span className="font-semibold">Wallet</span>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Rooms
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-zinc-600">
          世界観ごとの棚。増えても迷わないための整理軸。
        </p>
      </section>

      {/* Grid */}
      <section className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-3">
        {rooms.map((x) => (
          <a
            key={x.s}
            href={`/market?room=${x.s}`}
            className="block rounded-xl border bg-white p-6 hover:shadow-sm"
          >
            <div className="font-semibold">{x.t}</div>
            <p className="mt-2 text-sm text-zinc-600">{x.d}</p>
          </a>
        ))}
      </section>

      {/* Footer */}
      <footer className="mx-auto mt-20 max-w-6xl border-t px-6 py-10 text-sm text-zinc-500">
        © NURU MARKET — rooms prototype
      </footer>
    </main>
  );
}
