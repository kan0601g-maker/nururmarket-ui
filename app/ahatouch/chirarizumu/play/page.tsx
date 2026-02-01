// app/ahatouch/chirarizumu/play/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  listChirarizumuImages,
  getChirarizumuImageSrcById,
  revokeUrl,
  type StoredImage,
} from "../../_components/chirarizumuImages";

type DifficultyKey = "easy" | "normal" | "hard" | "max" | "aha";

type Difficulty = {
  key: DifficultyKey;
  label: string;
  cols: number;
  rows: number;
  maxPieces: number;
  defaultMaxFlips: number;
  safeN: number; // 最初のN回だけ safeSet 以外をロック
};

const DIFFICULTIES: Difficulty[] = [
  { key: "easy", label: "EASY（4×4）", cols: 4, rows: 4, maxPieces: 16, defaultMaxFlips: 4, safeN: 4 },
  { key: "normal", label: "NORMAL（6×6）", cols: 6, rows: 6, maxPieces: 36, defaultMaxFlips: 6, safeN: 6 },
  { key: "hard", label: "HARD（8×8）", cols: 8, rows: 8, maxPieces: 64, defaultMaxFlips: 8, safeN: 8 },
  { key: "max", label: "MAX（100）（10×10）", cols: 10, rows: 10, maxPieces: 100, defaultMaxFlips: 10, safeN: 10 },
  { key: "aha", label: "Aha（400）（20×20）", cols: 20, rows: 20, maxPieces: 400, defaultMaxFlips: 14, safeN: 14 },
];

// 0..max-1 から count 個、重複なしでランダム抽選
const pickRandomUnique = (max: number, count: number) => {
  const s = new Set<number>();
  const c = Math.max(0, Math.min(count, max));
  while (s.size < c) s.add(Math.floor(Math.random() * max));
  return s;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function ChirarizumuPlayPage() {
  const sp = useSearchParams();
  const idFromQuery = sp.get("id") ?? "";

  const [images, setImages] = useState<StoredImage[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");

  const [difficultyKey, setDifficultyKey] = useState<DifficultyKey>("max");

  const difficulty = useMemo(() => {
    return DIFFICULTIES.find((d) => d.key === difficultyKey) ?? DIFFICULTIES[3];
  }, [difficultyKey]);

  const cols = difficulty.cols;
  const rows = difficulty.rows;
  const total = cols * rows;

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [opened, setOpened] = useState<number[]>([]);
  const [flipCount, setFlipCount] = useState<number>(0);

  // “めくれる枚数”はカスタム可能。resetで初期値に戻すため base を持つ
  const [baseMaxFlips, setBaseMaxFlips] = useState<number>(difficulty.defaultMaxFlips);
  const [maxFlips, setMaxFlips] = useState<number>(difficulty.defaultMaxFlips);

  // 方式A：最初のN回だけ、safeSet に入ってるマスだけ開けられる
  const [safeSet, setSafeSet] = useState<Set<number>>(new Set());

  const [message, setMessage] = useState<string>("");

  // Ahaボタン用：連打防止クールタイム
  const lastAhaAtRef = useRef<number>(0);

  // 音（iOS対策：ユーザー操作で初めて鳴る。ボタン押下ならOK）
  const ahaAudioRef = useRef<HTMLAudioElement | null>(null);

  const prevUrlRef = useRef<string | null>(null);

  // 画像リスト読み込み
  useEffect(() => {
    const list = listChirarizumuImages();
    setImages(list);
    const picked = idFromQuery || list[0]?.id || "";
    setSelectedId(picked);
  }, [idFromQuery]);

  // selectedId が変わったら blob URL 取得
  useEffect(() => {
    let mounted = true;

    const run = async () => {
      setMessage("");
      // revoke old
      if (prevUrlRef.current) {
        revokeUrl(prevUrlRef.current);
        prevUrlRef.current = null;
      }
      if (!selectedId) {
        setImageUrl(null);
        return;
      }
      const url = await getChirarizumuImageSrcById(selectedId);
      if (!mounted) return;
      setImageUrl(url);
      prevUrlRef.current = url;
    };

    run();

    return () => {
      mounted = false;
    };
  }, [selectedId]);

  // 初回にAudio生成
  useEffect(() => {
    ahaAudioRef.current = new Audio("/sounds/aha.mp3");
    if (ahaAudioRef.current) ahaAudioRef.current.volume = 0.18;
    return () => {
      try {
        if (ahaAudioRef.current) {
          ahaAudioRef.current.pause();
          ahaAudioRef.current.currentTime = 0;
        }
      } catch {}
      ahaAudioRef.current = null;
    };
  }, []);

  // difficulty 変化時：盤面・初期値を更新して reset
  useEffect(() => {
    const nextBase = difficulty.defaultMaxFlips;
    setBaseMaxFlips(nextBase);
    setMaxFlips(nextBase);

    setOpened([]);
    setFlipCount(0);
    setMessage("");
    setSafeSet(pickRandomUnique(total, difficulty.safeN));
  }, [difficultyKey, difficulty.defaultMaxFlips, difficulty.safeN, total]);

  const resetGame = () => {
    setOpened([]);
    setFlipCount(0);
    setMessage("");
    setMaxFlips(baseMaxFlips); // ←増えっぱなしを強制リセット
    setSafeSet(pickRandomUnique(total, difficulty.safeN));
  };

  const incMaxFlips = () => {
    const next = clamp(maxFlips + 1, 1, total);
    setMaxFlips(next);
    setMessage("ロック上限を+1しました（ヒント増）。");
  };

  const decMaxFlips = () => {
    const next = clamp(maxFlips - 1, 1, total);
    setMaxFlips(next);
    setMessage("ロック上限を-1しました。");
  };

  const playAha = async () => {
    const now = Date.now();
    if (now - lastAhaAtRef.current < 2500) return; // 2.5秒クール
    lastAhaAtRef.current = now;

    setMessage("Aha!!（わかった）");

    const a = ahaAudioRef.current;
    if (!a) return;

    try {
      a.currentTime = 0;
      await a.play();
    } catch {
      // iOSなどで失敗するケースがあるが、ボタン押下なので通常は鳴る
    }
  };

  const onOpen = (i: number) => {
    setMessage("");

    if (!imageUrl) {
      setMessage("画像が未選択です。先に画像を選んでね。");
      return;
    }
    if (opened.includes(i)) return;
    if (flipCount >= maxFlips) {
      setMessage("めくれる上限に達したよ。＋で増やすか、リセットしてね。");
      return;
    }

    // 方式A：最初のN回は safeSet のみ
    if (flipCount < difficulty.safeN) {
      if (!safeSet.has(i)) {
        setMessage(`最初の${difficulty.safeN}回は「指定マス」だけ（ランダム）。`);
        return;
      }
    }

    setOpened((prev) => [...prev, i]);
    setFlipCount((c) => c + 1);
  };

  /**
   * ✅ 右はみ出し対策（本命）
   * - タイルサイズ(px固定)をやめて、画面幅から逆算
   * - 横スクロールは出さない（overflow-x-hidden）
   *
   * 目標：
   * - どの難易度でも “横に溢れない”
   * - 20×20(Aha)でも遊べるサイズに落とす
   */
  const gapPx = useMemo(() => {
    if (cols >= 20) return 2;
    if (cols >= 10) return 4;
    if (cols >= 8) return 6;
    return 8;
  }, [cols]);

  const tileSize = useMemo(() => {
    // スマホ幅に収める：vwで計算（左右padding分をざっくり引く）
    // pxの上限も付けて、PCで巨大化しすぎないようにする
    const maxPx =
      cols <= 4 ? 120 :
      cols <= 6 ? 96 :
      cols <= 8 ? 76 :
      cols <= 10 ? 60 :
      34; // 20x20の上限

    // (100vw - 32px) を盤面の可用幅に見立てる（px-4相当）
    const available = `calc((100vw - 32px - ${gapPx * (cols - 1)}px) / ${cols})`;
    // Tailwindが絡まないよう inline style で min/max を使う
    // min: 小さすぎると操作不能になるので最低値を置く
    const minPx = cols >= 20 ? 14 : cols >= 10 ? 18 : 22;

    // CSSのmin/maxを使えないので、JS側は「だいたい」→実測はCSS任せにするため
    // tileは styleで width/height に calc を入れる
    // ここでは「maxPx」を返しておく（tile側で min/max を掛ける）
    return { available, minPx, maxPx };
  }, [cols, gapPx]);

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
    gap: `${gapPx}px`,
    justifyContent: "start",
    width: "100%",
    maxWidth: "100%",
  };

  const tileCommon = (isInSafe: boolean, isOpen: boolean, bgStyle: React.CSSProperties): React.CSSProperties => ({
    width: `min(${tileSize.maxPx}px, max(${tileSize.minPx}px, ${tileSize.available}))`,
    height: `min(${tileSize.maxPx}px, max(${tileSize.minPx}px, ${tileSize.available}))`,
    borderRadius: cols >= 10 ? "10px" : "12px",
    border: "1px solid rgba(0,0,0,0.25)",
    backgroundColor: "white",
    overflow: "hidden",
    userSelect: "none",
    cursor: "pointer",
    outline: "none",
    boxShadow: isInSafe ? "0 0 0 2px rgba(0,0,0,0.55) inset" : undefined,
    ...bgStyle,
    // クリックできる見た目（閉じてるときだけ少し持ち上げ）
    transform: !isOpen && isInSafe ? "translateY(-0.5px)" : undefined,
  });

  const renderTile = (i: number) => {
    const isOpen = opened.includes(i);
    const x = i % cols;
    const y = Math.floor(i / cols);

    const bgStyle: React.CSSProperties =
      isOpen && imageUrl
        ? {
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: `${cols * 100}% ${rows * 100}%`,
            backgroundPosition: `${(x / (cols - 1 || 1)) * 100}% ${(y / (rows - 1 || 1)) * 100}%`,
            backgroundRepeat: "no-repeat",
          }
        : {};

    // safeSet 表示（最初のN回だけ薄く“許可マス感”を出す）
    const isInSafe = difficulty.safeN > 0 && flipCount < difficulty.safeN && safeSet.has(i);

    return (
      <button
        key={i}
        onClick={() => onOpen(i)}
        style={tileCommon(isInSafe, isOpen, bgStyle)}
        aria-label={`tile-${i}`}
      >
        {!isOpen ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "grid",
              placeItems: "center",
              fontWeight: 700,
              color: "rgba(0,0,0,0.75)",
              fontSize: cols >= 20 ? "10px" : cols >= 10 ? "12px" : "14px",
            }}
          >
            ?
          </div>
        ) : null}
      </button>
    );
  };

  return (
    <main className="min-h-screen bg-white text-zinc-900 overflow-x-hidden">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-8">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-3xl font-bold">みんなでチラリズム（Play）</h1>
            <p className="mt-2 text-sm opacity-70">
              最初の{difficulty.safeN}回は「指定マスのみ」（ランダム）。会話しながらヒント調整する前提。
            </p>
          </div>

          <Link href="/ahatouch/chirarizumu" className="shrink-0 text-sm underline opacity-80 hover:opacity-100">
            ← 戻る
          </Link>
        </div>

        {/* info box */}
        <div className="mt-4 rounded-2xl border border-black/15 bg-white p-4 text-sm">
          <div>保存画像：{images.length}件 / 表示ID：{selectedId || "（なし）"}</div>
          <div className="mt-1 opacity-70">画像URL：{imageUrl ? "OK（blob生成済）" : "未生成"}</div>
          {message ? <div className="mt-2 font-semibold">{message}</div> : null}
        </div>

        {/* difficulties */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <div className="mr-2 text-sm font-semibold opacity-80">難易度</div>
          {DIFFICULTIES.map((d) => {
            const active = d.key === difficultyKey;
            return (
              <button
                key={d.key}
                onClick={() => setDifficultyKey(d.key)}
                className={[
                  "rounded-xl border px-4 py-2 text-sm transition",
                  active ? "bg-black text-white border-black" : "bg-white text-black border-black/25 hover:bg-black/5",
                ].join(" ")}
              >
                {d.label}
              </button>
            );
          })}
        </div>

        {/* controls */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <div className="rounded-xl border border-black/25 px-4 py-2 text-sm">
            めくり：<b>{flipCount}</b>/<b>{maxFlips}</b>
          </div>

          <button
            onClick={decMaxFlips}
            className="rounded-xl border border-black/25 bg-white px-4 py-2 text-sm hover:bg-black/5"
          >
            めくれる枚数 -1
          </button>
          <button
            onClick={incMaxFlips}
            className="rounded-xl border border-black/25 bg-white px-4 py-2 text-sm hover:bg-black/5"
          >
            めくれる枚数 +1
          </button>

          <button
            onClick={resetGame}
            className="rounded-xl border border-black/25 bg-white px-4 py-2 text-sm hover:bg-black/5"
          >
            リセット
          </button>

          {/* ★ Ahaボタン（主催/相手が押す） */}
          <button
            onClick={playAha}
            className="ml-auto rounded-xl border border-black bg-black px-4 py-2 text-sm text-white hover:opacity-90 transition"
            title="わかった！の合図（音が鳴る）"
          >
            Aha!
          </button>
        </div>

        {/* board */}
        <div className="mt-6 rounded-2xl border border-black/25 bg-white p-4 overflow-x-hidden">
          <div style={gridStyle}>
            {Array.from({ length: total }).map((_, i) => renderTile(i))}
          </div>
        </div>
      </div>
    </main>
  );
}
