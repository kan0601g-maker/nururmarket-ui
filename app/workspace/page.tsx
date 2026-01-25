// app/workspace/page.tsx
import AppHeader from "../components/AppHeader";

type AppTile = {
  title: string;
  desc: string;
  href: string;
  status?: string; // 例: "開発中①"
};

const tiles: AppTile[] = [
  { title: "Starleaf", desc: "構想・設計・思考を育てるメインアプリ。", href: "/starleaf" },
  { title: "Board", desc: "掲示板：メモ・同期・共有用。", href: "/rooms", status: "開発中①" },

  { title: "Logs", desc: "運用・履歴・日々の記録。", href: "/rooms", status: "開発中②" },
  { title: "Settings", desc: "アカウント・母艦の設定。", href: "/rooms", status: "開発中③" },

  { title: "App (開発中④)", desc: "ここにアプリを追加していく。", href: "/rooms" },
  { title: "App (開発中⑤)", desc: "ここにアプリを追加していく。", href: "/rooms" },

  { title: "App (開発中⑥)", desc: "ここにアプリを追加していく。", href: "/rooms" },
  { title: "App (開発中⑦)", desc: "ここにアプリを追加していく。", href: "/rooms" },
];

export default function WorkspacePage() {
  return (
    <main className="min-h-screen bg-lime-50 text-zinc-900">
      <AppHeader leftTitle="ヌルマーケット" rightLink={{ href: "/", label: "HOMEへ戻る" }} />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="text-4xl font-semibold tracking-tight">WORK SPACE</h1>
        <p className="mt-4 max-w-2xl text-zinc-600">
          内部アプリの起動と管理。<br />
          売り場と切り離された作業空間。
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {tiles.map((t) => (
            <a
              key={t.title}
              href={t.href}
              className="group block rounded-2xl border border-zinc-300 bg-white p-6 transition hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="text-lg font-semibold">{t.title}</div>
                {t.status ? (
                  <span className="rounded-full border border-zinc-300 bg-white px-2 py-0.5 text-xs text-zinc-700">
                    {t.status}
                  </span>
                ) : null}
              </div>
              <div className="mt-2 text-sm text-zinc-600">{t.desc}</div>
              <div className="mt-4 text-sm font-semibold text-zinc-900 group-hover:underline">
                → 開く
              </div>
            </a>
          ))}
        </div>

        <footer className="mx-auto mt-14 max-w-6xl border-t border-zinc-300 pt-8 text-sm text-zinc-500">
          © ヌルマーケット — workspace
        </footer>
      </section>
    </main>
  );
}
