import Link from "next/link";

export default function PlacePage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold">NURU Market Place</h1>
            <p className="mt-2 text-sm opacity-80">売り場（仮）。あとで実装する。</p>
          </div>

          <Link
            href="/workspace"
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
          >
            NURU PORTAL
          </Link>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm opacity-80">
          ここにマーケットUIを作っていく。
        </div>
      </div>
    </main>
  );
}
