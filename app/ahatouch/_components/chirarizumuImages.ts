// app/ahatouch/_components/chirarizumuImages.ts

export type ChirarizumuCategory = "animals" | "flowers" | "world";

export type ChirarizumuImage = {
  id: string;
  category: ChirarizumuCategory;
  title?: string;
};

/**
 * play 側で localStorage 等に保存する用の最小型
 * （必要になったら項目追加でOK）
 */
export type StoredImage = {
  id: string;
  url: string;
};

export const chirarizumuImages: ChirarizumuImage[] = [
  // 🐾 animals
  { id: "animals_001", category: "animals" },
  { id: "animals_002", category: "animals" },
  { id: "animals_003", category: "animals" },
  { id: "animals_004", category: "animals" },
  { id: "animals_005", category: "animals" },
  { id: "animals_006", category: "animals" },
  { id: "animals_007", category: "animals" },
  { id: "animals_008", category: "animals" },
  { id: "animals_009", category: "animals" },
  { id: "animals_010", category: "animals" },

  // 🌸 flowers
  { id: "flowers_001", category: "flowers" },
  { id: "flowers_002", category: "flowers" },
  { id: "flowers_003", category: "flowers" },
  { id: "flowers_004", category: "flowers" },
  { id: "flowers_005", category: "flowers" },
  { id: "flowers_006", category: "flowers" },
  { id: "flowers_007", category: "flowers" },
  { id: "flowers_008", category: "flowers" },

  // 🌍 world
  { id: "world_001", category: "world" },
  { id: "world_002", category: "world" },
  { id: "world_003", category: "world" },
  { id: "world_004", category: "world" },
  { id: "world_005", category: "world" },
  { id: "world_006", category: "world" },
  { id: "world_007", category: "world" },
  { id: "world_008", category: "world" },
  { id: "world_009", category: "world" },
];

/**
 * 指定カテゴリの画像リストを返す
 */
export const listChirarizumuImages = (category?: ChirarizumuCategory | null) => {
  if (!category) return chirarizumuImages;
  return chirarizumuImages.filter((x) => x.category === category);
};

/**
 * 画像IDから src を作る
 * ここは実ファイルの置き場所に合わせて変更してOK。
 *
 * 例: public/ahatouch/chirarizumu/animals_001.jpg があるなら
 * "/ahatouch/chirarizumu/animals_001.jpg"
 */
export const getChirarizumuImagesSrcById = (id: string) => {
  // 拡張子はとりあえず .jpg 想定。pngなら .png に変更。
  return `/ahatouch/chirarizumu/${id}.jpg`;
};

/**
 * URL.createObjectURL() で作ったURLを破棄
 */
export const revokeUrl = (url?: string | null) => {
  if (!url) return;
  try {
    URL.revokeObjectURL(url);
  } catch {}
};
// --- storage helpers (optional, for client-side save/clear) ---
const STORAGE_KEY = "ahatouch_chirarizumu_images";

export const loadStoredChirarizumuImages = (): StoredImage[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // 最低限の形だけ保証
    return parsed
      .filter((x) => x && typeof x.id === "string" && typeof x.url === "string")
      .map((x) => ({ id: x.id, url: x.url }));
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
 * 画像を追加（同じidは上書き）
 */
export const addChirarizumuImages = (item: StoredImage) => {
  const cur = loadStoredChirarizumuImages();
  const next = [item, ...cur.filter((x) => x.id !== item.id)];
  saveStoredChirarizumuImages(next);
  return next;
};

/**
 * 全削除
 */
export const clearChirarizumuImages = () => {
  if (typeof window === "undefined") return [];
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
  return [];
};
