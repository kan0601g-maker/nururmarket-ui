import AppHeader from "./components/AppHeader";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <AppHeader leftTitle="ヌルマーケット" />

      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <div className="mb-6 text-6xl">👑</div>

        <h1 className="text-4xl font-semibold md:text-5xl">
          NURU MARKET
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-zinc-600">
          アプリを束ねる母艦。<br />
          売り場と作業場を、はっきり分ける。
        </p>
      </section>

      <section className="mx-auto grid max-w-4xl gap-8 px-6 md:grid-cols-2">
        <a
          href="/market"
          className="rounded-2xl border p-8 transition hover:shadow-md"
        >
          <div className="text-sm font-semibold text-zinc-500">
            Public / Showcase
          </div>
          <div className="mt-3 text-2xl font-semibold">
            NURU MARKET
          </div>
          <p className="mt-4 text-zinc-600">
            並べる・探す・見せる。
          </p>
        </a>

        <a
          href="/workspace"
          className="rounded-2xl border bg-zinc-50 p-8 transition hover:shadow-md"
        >
          <div className="text-sm font-semibold text-zinc-500">
            Private / Tools
          </div>
          <div className="mt-3 text-2xl font-semibold">
            WORK SPACE
          </div>
          <p className="mt-4 text-zinc-600">
            構築・管理・育成。
          </p>
        </a>
      </section>
    </main>
  );
}
