"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

// ✅ 既存のimportはそのまま残してOK（例）
// import { AHA_CATEGORIES, getCategory } from "../_components/Categories";
// import { listImagesByCategory, pickRandom, type AhaImage } from "../_components/getImages";

function QuizInner() {
  const sp = useSearchParams(); // ✅ Suspense の内側で呼ぶ

  // ===== ここから下を「元の quiz/page.tsx の中身」に戻す =====
  // 例）あなたの今のロジック（そのまま移植）
  // const catParam = sp.get("cat");
  // const catObj = catParam ? getCategory(catParam) : null;
  // const cat = catObj?.id ?? "animals";
  //
  // const [cards, setCards] = useState<Card[]>([]);
  // const title = useMemo(() => {...}, [cat]);
  //
  // useEffect(() => {...}, [cat, title]);

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-sm opacity-70">
        QuizInnerのreturnが入ってないとビルドで落ちるので、ここをあなたのUIに置き換えてね
      </div>
    </main>
  );
  // ===== ここまで =====
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-sm opacity-70">読み込み中…</div>
        </main>
      }
    >
      <QuizInner />
    </Suspense>
  );
}
