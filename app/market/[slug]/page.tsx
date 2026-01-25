import AppHeader from "../../components/AppHeader";
export default function MarketPage() {
  return (
    <main className="min-h-screen bg-pink-50 text-zinc-900">
      <AppHeader
        leftTitle="NURU MARKET"
        rightLink={{ href: "/", label: "HOMEへ戻る" }}
      />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-semibold mb-8">
          マーケット
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow">
            カード①
          </div>
          <div className="rounded-xl bg-white p-6 shadow">
            カード②
          </div>
          <div className="rounded-xl bg-white p-6 shadow">
            カード③
          </div>
        </div>
      </section>
    </main>
  );
}
