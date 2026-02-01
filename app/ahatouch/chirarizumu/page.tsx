// app/ahatouch/_components/chirarizumuImages.ts

export type StoredImage = {
  id: string;      // 一意ID
  url: string;     // objectURL
  name: string;    // 表示名
};

const STORAGE_KEY = "ahatouch_chirarizumu_images";

/**
 * URL.createObjectURL() で作ったURLを破棄
 */
export const revokeUrl = (url?: string | null) => {
  if (!url) return;
  try {
    URL.revokeObjectURL(url);
  } catch {}
};

export const loadStoredChirarizumuImages = (): StoredImage[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(
        (x) =>
          x &&
          typeof x.id === "string" &&
          typeof x.url === "string" &&
          typeof x.name === "string"
      )
      .map((x) => ({ id: x.id, url: x.url, name: x.name }));
  } catch {
    return [];
  }
};

export const saveStoredChirarizumuImages = (items: StoredImage[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
};

/**
 * 一覧（このページが欲しいのは StoredImage[]）
 */
export const listChirarizumuImages = (): StoredImage[] => {
  return loadStoredChirarizumuImages();
};

/**
 * id から objectURL を返す（無ければ null）
 */
export const getChirarizumuImageSrcById = async (id: string) => {
  const items = loadStoredChirarizumuImages();
  const found = items.find((x) => x.id === id);
  return found?.url ?? null;
};

// alias（名前揺れ対策）
export const getChirarizumuImagesSrcById = getChirarizumuImageSrcById;

/**
 * 追加：FileList を受け取り、objectURL を作って保存する
 * ※ objectURL はブラウザ内の一時URL。ページ側で revoke してOK。
 */
export const addChirarizumuImages = async (files: FileList) => {
  const cur = loadStoredChirarizumuImages();
  const next = [...cur];

  for (const f of Array.from(files)) {
    const id =
      (globalThis.crypto?.randomUUID?.() as string | undefined) ??
      `${Date.now()}_${Math.random().toString(16).slice(2)}`;

    const url = URL.createObjectURL(f);

    next.unshift({
      id,
      url,
      name: f.name || "image",
    });
  }

  saveStoredChirarizumuImages(next);
  return next;
};

/**
 * 全削除（※ objectURL の revoke は呼び出し側でやる）
 */
export const clearChirarizumuImages = async () => {
  if (typeof window === "undefined") return [];
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
  return [];
};

// alias（名前揺れ対策）
export const addChirarizumuImage = addChirarizumuImages;
export const clearChirarizumuImage = clearChirarizumuImages;
