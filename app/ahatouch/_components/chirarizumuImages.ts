// app/ahatouch/_components/chirarizumuImages.ts
"use client";

/**
 * みんなでチラリズム：画像ストレージ管理（localStorage）
 *
 * - 取り込み画像は localStorage に DataURL として保存
 * - index（一覧）も localStorage に保存
 * - 固定画像（public配下）は「混ぜない」方針
 *   → UI側が明示的に使いたい時だけ fallback 関数を呼ぶ
 */

export type ChiraMeta = {
  id: string;
  name: string;
  createdAt: number; // epoch ms
};

// 互換のため残す（既存コードが参照してても壊れない）
export type StoredChiraMeta = ChiraMeta;

const INDEX_KEY = "ahatouch_chirarizumu_index_v1";
const ITEM_KEY_PREFIX = "ahatouch_chirarizumu_item_v1_";

/** JSONパースの安全版 */
const safeJsonParse = <T,>(raw: string | null): T | null => {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

/** index読み込み */
const loadIndex = (): ChiraMeta[] => {
  const data = safeJsonParse<ChiraMeta[]>(localStorage.getItem(INDEX_KEY));
  if (!Array.isArray(data)) return [];
  return data
    .filter(
      (x) =>
        x &&
        typeof x.id === "string" &&
        typeof x.name === "string" &&
        typeof x.createdAt === "number"
    )
    .sort((a, b) => b.createdAt - a.createdAt);
};

/** index保存 */
const saveIndex = (list: ChiraMeta[]) => {
  try {
    localStorage.setItem(INDEX_KEY, JSON.stringify(list));
  } catch {
    // no-op
  }
};

/** ID生成（衝突しにくい） */
const makeId = () => {
  const t = Date.now().toString(36);
  const r = Math.random().toString(36).slice(2, 10);
  return `chira_${t}_${r}`;
};

/** File → DataURL */
const readAsDataURL = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onerror = () => reject(new Error("FileReader error"));
    fr.onload = () => resolve(String(fr.result ?? ""));
    fr.readAsDataURL(file);
  });

const isQuotaError = (e: unknown) => {
  // ブラウザによって name が違うことがあるので広めに判定
  const anyE = e as any;
  const name = String(anyE?.name ?? "");
  const msg = String(anyE?.message ?? "");
  return (
    name === "QuotaExceededError" ||
    name === "NS_ERROR_DOM_QUOTA_REACHED" ||
    msg.toLowerCase().includes("quota") ||
    msg.toLowerCase().includes("exceeded")
  );
};

/**
 * 画像を取り込んで保存（DataURL）
 * @returns 保存した id
 *
 * NOTE:
 * - page.tsx 側の catch が "storage_full" を見ているので
 *   容量系は new Error("storage_full") を投げる
 */
export async function saveChiraFromFile(file: File): Promise<string> {
  const dataUrl = await readAsDataURL(file);
  if (!dataUrl.startsWith("data:")) {
    throw new Error("Invalid DataURL");
  }

  const id = makeId();
  const name = file.name || id;
  const createdAt = Date.now();

  // 本体保存
  try {
    localStorage.setItem(ITEM_KEY_PREFIX + id, dataUrl);
  } catch (e) {
    if (isQuotaError(e)) throw new Error("storage_full");
    throw new Error("Failed to save image (localStorage)");
  }

  // index更新（先頭追加）
  const idx = loadIndex();
  const next: ChiraMeta[] = [{ id, name, createdAt }, ...idx].slice(0, 200);
  saveIndex(next);

  return id;
}

/** 取り込み済み一覧（metaのみ） */
export function listChiraImages(): ChiraMeta[] {
  try {
    return loadIndex();
  } catch {
    return [];
  }
}

/** id → DataURL(src) を取得（取り込み分のみ） */
export async function getChiraSrcById(id: string): Promise<string | null> {
  try {
    const raw = localStorage.getItem(ITEM_KEY_PREFIX + id);
    if (!raw) return null;
    return raw;
  } catch {
    return null;
  }
}

/**
 * 取り込み済み一覧（src付き）
 * page.tsx が欲しい形：ChiraMeta & { src: string | null }
 */
export async function listChiraWithSrc(): Promise<(ChiraMeta & { src: string | null })[]> {
  const meta = listChiraImages();
  const out: (ChiraMeta & { src: string | null })[] = [];
  for (const m of meta) {
    const src = await getChiraSrcById(m.id);
    out.push({ ...m, src });
  }
  return out;
}

/** 1件削除（取り込み分のみ） */
export function deleteChiraById(id: string): void {
  try {
    localStorage.removeItem(ITEM_KEY_PREFIX + id);
    const idx = loadIndex();
    const next = idx.filter((x) => x.id !== id);
    saveIndex(next);
  } catch {
    // no-op
  }
}

/** 全削除（取り込み分のみ） */
export function clearAllChira(): void {
  try {
    const idx = loadIndex();
    for (const x of idx) localStorage.removeItem(ITEM_KEY_PREFIX + x.id);
    localStorage.removeItem(INDEX_KEY);
  } catch {
    // no-op
  }
}

/**
 * URL解放（DataURL運用なので基本 no-op）
 * ※将来 ObjectURL に切り替えたら URL.revokeObjectURL を呼ぶ
 */
export function revokeUrl(_url: string): void {
  // no-op
}

/* =========================================================
 * 固定画像（public配下）を “混ぜずに” 使いたい時の任意フォールバック
 * ========================================================= */

/**
 * 方針：取り込み優先 → 無ければ固定へ（パスを返すだけ）
 */
export async function getChiraSrcByIdWithFallback(
  id: string,
  options?: { fallbackBasePath?: string; fallbackExt?: "jpg" | "png" | "webp" }
): Promise<string | null> {
  const stored = await getChiraSrcById(id);
  if (stored) return stored;

  const base = options?.fallbackBasePath ?? "/ahatouch/chirarizumu";
  const ext = options?.fallbackExt ?? "jpg";
  return `${base}/${id}.${ext}`;
}

/** 互換：昔の関数名が残ってても壊れないように */
export async function saveChiraImageFromFile(file: File): Promise<string> {
  return saveChiraFromFile(file);
}
