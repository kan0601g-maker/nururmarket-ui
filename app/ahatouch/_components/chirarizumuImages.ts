// app/ahatouch/_components/chirarizumuImages.ts

export type ChirarizumuCategory = "animals" | "flowers" | "world";

export type ChirarizumuImage = {
  id: string;
  category: ChirarizumuCategory;
  title?: string;
};

/**
 * localStorageに保存する用（アップロード画像）
 */
export type StoredImage = {
  id: string;
  url: string;   // objectURL
  name: string;  // 表示名
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
 * （静的）指定カテゴリの画像リストを返す
 * ※ こっちは ChirarizumuImage[] を返す
 */
export const listChirarizumuImages = (category?: ChirarizumuCategory | null) => {
  if (!category) return chirarizumuImages;
  return chirarizumuImages.filter((x) => x.category === category);
};

/**
 * （静的）画像IDから src を作る
 * 例: public/ahatouch/chirarizumu/animals_001.jpg があるなら
 * "/ahatouch/chirarizumu/animals_001.jpg"
 */
export const getChirarizumuImagesSrcById = (id: string) => {
  return `/ahatouch/chirarizumu/${id}.jpg`;
};

/**
 * import名揺れ対策（単数形）
 */
export const getChirarizumuImageSrcById = async (id: string) => {
  // ここは「静的」も「保存済み」も両対応にしておく（ビルド優先）
  const stored = loadStoredChirarizumuImages();
  const found = stored.find((x) => x.id === id);
  if (found?.url) return found.url;

  // 静的にフォールバック
  return getChirarizumuImagesSrcById(id);
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

// ========== 保存（アップロード）系 ==========
const STORAGE_KEY = "ahatouch_chirarizumu_images";

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
 * ✅ これが今回の本命：保存済み（Stored）専用の一覧
 * ※ 名前を変えて混線を断つ
 */
export const listStoredChirarizumuImages = (): StoredImage[] => {
  return loadStoredChirarizumuImages();
};

/**
 * 追加：FileList を受け取り、objectURL を作って保存する
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
 * 全削除（objectURLのrevokeは呼び出し側で）
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
