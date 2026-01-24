// app/page.tsx
import AppHeader from "./components/AppHeader";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-zinc-900">
      {/* Header */}
      <AppHeader leftTitle="ヌルマーケット" />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        {/* Crown */}
        <div className="mb-6 text-6xl leading-none">👑</div>

        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          NURU MARKET
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-zinc-600">
          アプリを束ねる母艦。<br />
          売り場と作業場を、はっきり分ける。
        </p>
      </section>

      {/* Entrances */}
      <section className="mx-auto grid max-w-4xl gap-8 px-6 md:grid-cols-2">
        {/* NURU MARKET */}
        <a
          href="/market"
          className="group block rounded-2xl border p-8 transition hover:shadow-md"
        >
          <div className="text-sm font-semibold text-zinc-500">
            Public / Showcase
          </div>
          <div className="mt-3 text-2xl font-semibold">
            NURU MARKET
          </div>
          <p className="mt-4 text-zinc-600">
            メルカリのような売り場。<br />
            並べる・探す・見せる。
          </p>
          <div className="mt-6 text-sm font-semibold text-zinc-900 group-hover:underline">
            → 入る
          </div>
        </a>

        {/* WORK SPACE */}
        <a
          href="/workspace"
          className="group block rounded-2xl border bg-zinc-50 p-8 transition hover:shadow-md"
        >
          <div className="text-sm font-semibold text-zinc-500">
            Private / Tools
          </div>
          <div className="mt-3 text-2xl font-semibold">
            WORK SPACE
          </div>
          <p className="mt-4 text-zinc-600">
            アプリ群の作業場。<br />
            構築・記録・管理。
          </p>
          <div className="mt-6 text-sm font-semibold text-zinc-900 group-hover:underline">
            → 入る
          </div>
        </a>
      </section>

      {/* Footer */}
      <footer className="mx-auto mt-24 max-w-6xl border-t px-6 py-10 text-sm text-zinc-500">
        © ヌルマーケット — mother ship
      </footer>
    </main>
  );
}
