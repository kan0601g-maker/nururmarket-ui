"use client";

export type StoredImage = {
  id: string; // 一意ID
  name: string; // 表示名（ファイル名など）
  createdAt: number; // ms epoch
  dataUrl: string; // 保存本体（DataURL）
};

export type ChiraMeta = {
  id: string;
  name: string;
  createdAt: number;
};

const INDEX_KEY = "ahatouch_chirarizumu_index_v1";
const ITEM_KEY_PREFIX = "ahatouch_chirarizumu_item_v1:";

// 画像IDから固定画像へフォールバックしたい場合（一覧には混ぜない）
// 例: public/ahatouch/chirarizumu/animals_001.jpg
export const FALLBACK_PREFIX = "/ahatouch/chirarizumu/";
export const FALLBACK_EXT = ".jpg";

// -----------------------
// utils
// -----------------------
const safeJsonParse = <T>(raw: string | null): T | null => {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

const uid = () => {
  // crypto.randomUUID があればそれを使う
  // （iOS Safariでも最近は大体あるが、無ければフォールバック）
  try {
    // @ts-ignore
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      // @ts-ignore
      return crypto.randomUUID() as string;
    }
  } catch {}
  return `chira_${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result || ""));
    r.onerror = () => reject(new Error("file read failed"));
    r.readAsDataURL(file);
  });

const loadIndex = (): ChiraMeta[] => {
  try {
    const raw = localStorage.getItem(INDEX_KEY);
    const arr = safeJsonParse<ChiraMeta[]>(raw);
    if (!Array.isArray(arr)) return [];
    return arr
      .filter(
        (x) =>
          x &&
          typeof x.id === "string" &&
          typeof x.name === "string" &&
          typeof x.createdAt === "number"
      )
      .sort((a, b) => b.createdAt - a.createdAt);
  } catch {
    return [];
  }
};

const saveIndex = (list: ChiraMeta[]) => {
  try {
    localStorage.setItem(INDEX_KEY, JSON.stringify(list));
  } catch {
    // no-op
  }
};

const saveItem = (img: StoredImage) => {
  try {
    localStorage.setItem(ITEM_KEY_PREFIX + img.id, JSON.stringify(img));
  } catch {
    // no-op
  }
};

const loadItem = (id: string): StoredImage | null => {
  try {
    const raw = localStorage.getItem(ITEM_KEY_PREFIX + id);
    const obj = safeJsonParse<StoredImage>(raw);
    if (!obj) return null;
    if (
      typeof obj.id === "string" &&
      typeof obj.name === "string" &&
      typeof obj.createdAt === "number" &&
      typeof obj.dataUrl === "string"
    ) {
      return obj;
    }
  } catch {}
  return null;
};

// -----------------------
// public APIs
// -----------------------

/**
 * 取り込み：File -> DataURL 保存
 * 戻り値：生成した id
 */
export async function saveChiraImageFromFile(file: File): Promise<string> {
  const dataUrl = await fileToDataUrl(file);
  const id = uid();
  const img: StoredImage = {
    id,
    name: file.name || "image",
    createdAt: Date.now(),
    dataUrl,
  };

  // 保存
  saveItem(img);

  // index更新（先頭に追加）
  const idx = loadIndex();
  const next: ChiraMeta[] = [{ id: img.id, name: img.name, createdAt: img.createdAt }, ...idx];
  saveIndex(next);

  return id;
}

/**
 * 一覧：取り込み済みのメタだけ返す（固定画像は混ぜない）
 */
export async function listChiraImages(): Promise<ChiraMeta[]> {
  return loadIndex();
}

/**
 * id->src
 * 1) 保存済みがあれば DataURL を返す
 * 2) なければ固定画像へフォールバック（/ahatouch/chirarizumu/${id}.jpg）
 */
export async function getChiraSrcById(id: string): Promise<string | null> {
  if (!id) return null;

  const stored = loadItem(id);
  if (stored?.dataUrl) return stored.dataUrl;

  // フォールバック（存在チェックはしない：404でもimg側で吸収）
  // ※「固定画像が入り込む」問題は “一覧に混ぜない” ことで解決する
  return `${FALLBACK_PREFIX}${id}${FALLBACK_EXT}`;
}

/**
 * 1件削除（取り込み済みのみ対象）
 */
export function deleteChiraById(id: string): void {
  if (!id) return;
  try {
    localStorage.removeItem(ITEM_KEY_PREFIX + id);
    const idx = loadIndex();
    const next = idx.filter((x) => x.id !== id);
    saveIndex(next);
  } catch {
    // no-op
  }
}

/**
 * 全削除（取り込み済みのみ）
 */
export function clearAllChira(): void {
  try {
    const idx = loadIndex();
    for (const x of idx) localStorage.removeItem(ITEM_KEY_PREFIX + x.id);
    localStorage.removeItem(INDEX_KEY);
  } catch {
    // no-op
  }
}
