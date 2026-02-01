"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { listChiraWithSrc, saveChiraFromFile, type ChiraMeta } from "../_components/chirarizumuImages";

type Item = ChiraMeta & { src: string | null };

export default function Page() {
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const refresh = async () => {
    const list = await listChiraWithSrc();
    setItems(list);
  };

  useEffect(() => {
    refresh();
  }, []);

  const onPick = async (file: File | null) => {
    if (!file) return;

    setBusy(true);
    setMsg(null);

    try {
      await saveChiraFromFile(file);
      await refresh();
      setMsg("追加しました");
    } catch (e: any) {
      if (String(e?.message || "") === "storage_full") {
        setMsg("保存容量がいっぱいです（画像が大きい可能性）。別の小さめ画像で試すか、画像を減らしてね。");
      } else {
        setMsg("追加に失敗しました");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">みんなでチラリズム</h1>
            <p className="mt-2 text-sm opacity-80">画像を取り込み → パズル（共有は将来）</p>
          </div>

          <Link
            href="/ahatouch"
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
          >
            AHA TOUCH HOME
          </Link>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex flex-wrap items-center gap-3">
            <label className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition cursor-pointer">
              {busy ? "取り込み中…" : "画像を取り込む"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={busy}
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null;
                  // 同じファイルを連続で選んでも onChange が走るようにリセット
                  e.currentTarget.value = "";
                  onPick(f);
                }}
              />
            </label>

            {msg && <div className="text-sm opacity-80">{msg}</div>}
          </div>

          <div className="mt-3 text-xs opacity-60">
            ※ 現段階では端末内保存（localStorage）です（本当の共有は後で）
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold">取り込み済み</h2>

          {items.length === 0 ? (
            <div className="mt-3 text-sm opacity-70">まだ画像がありません。</div>
          ) : (
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {items.map((x) => (
                <Link
                  key={x.id}
                  href={`/ahatouch/chirarizumu/play?id=${encodeURIComponent(x.id)}&diff=normal`}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
                >
                  <div className="p-4">
                    {x.src && (
                      <div className="mb-3 overflow-hidden rounded-xl border border-white/10">
                        <img
                          src={x.src}
                          alt={x.name}
                          className="w-full h-40 object-cover"
                          draggable={false}
                        />
                      </div>
                    )}

                    <div className="text-sm font-semibold truncate">{x.name}</div>
                    <div className="mt-1 text-xs opacity-60">{new Date(x.createdAt).toLocaleString()}</div>

                    <div className="mt-3 text-sm opacity-80 underline underline-offset-4">
                      この画像でパズル →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
