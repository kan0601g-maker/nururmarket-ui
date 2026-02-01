"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

// 既存のimportはそのまま
// import { ... } from "../_components/....";

function QuizInner() {
  const sp = useSearchParams(); // ✅ Suspense の内側

  // ====== ここから下は「今の quiz/page.tsx の中身をそのまま」 ======
  // const catParam = sp.get("cat");
  // const catObj = catParam ? getCategory(catParam) : null;
  // const cat = catObj?.id ?? "animals";
  //
  // return (
  //   ...あなたの既存UI...
  // );
  // ================================================================
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
