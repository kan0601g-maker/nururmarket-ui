// app/starleaf/page.tsx
export default function StarleafPage() {
  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="font-semibold tracking-tight">Starleaf</div>
          <a
            href="/workspace"
            className="text-sm text-zinc-600 hover:text-zinc-900 hover:underline"
          >
            ← WORK SPACEへ戻る
          </a>
        </div>
      </header>

      {/* Body */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Starleaf
        </h1>
        <p className="mt-4 max-w-2xl text-zinc-600">
          構想・設計・思考を育てるメインアプリ。<br />
          ここから中身を増やしていく。
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border bg-white p-6">
            <div className="font-semibold">Drafts</div>
            <p className="mt-2 text-sm text-zinc-600">未整理のメモ。</p>
          </div>
          <div className="rounded-xl border bg-white p-6">
            <div className="font-semibold">Notes</div>
            <p className="mt-2 text-sm text-zinc-600">育てる文章。</p>
          </div>
          <div className="rounded-xl border bg-white p-6">
            <div className="font-semibold">Links</div>
            <p className="mt-2 text-sm text-zinc-600">参照・関連。</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto mt-20 max-w-6xl border-t px-6 py-10 text-sm text-zinc-500">
        © NURU MARKET — Starleaf
      </footer>
    </main>
  );
}
