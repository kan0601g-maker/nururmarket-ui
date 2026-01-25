import AppHeader from "../components/AppHeader";
export default function WorkspacePage() {
  return (
    <main className="min-h-screen bg-green-50 text-zinc-900">
      <AppHeader
        leftTitle="WORK SPACE"
        rightLink={{ href: "/", label: "HOMEへ戻る" }}
      />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-semibold mb-8">
          アプリ一覧
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow">
            Starleaf
          </div>
          <div className="rounded-xl bg-white p-6 shadow">
            開発中①
          </div>
          <div className="rounded-xl bg-white p-6 shadow">
            開発中②
          </div>
        </div>
      </section>
    </main>
  );
}
