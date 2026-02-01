"use client";

export type ChiraMeta = {
  id: string;
  name: string;
  createdAt: number;
};

type StoredChira = {
  id: string;
  name: string;
  createdAt: number;
  dataUrl: string; // compressed jpeg dataURL
};

const INDEX_KEY = "ahatouch_chira_index_v2";
const ITEM_KEY_PREFIX = "ahatouch_chira_item_v2:";

const safeJsonParse = <T,>(raw: string | null): T | null => {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

const loadIndex = (): ChiraMeta[] => {
  const idx = safeJsonParse<ChiraMeta[]>(localStorage.getItem(INDEX_KEY));
  if (!idx || !Array.isArray(idx)) return [];
  return idx.filter(
    (x) =>
      x &&
      typeof (x as any).id === "string" &&
      typeof (x as any).name === "string" &&
      typeof (x as any).createdAt === "number"
  );
};

const saveIndex = (idx: ChiraMeta[]) => {
  localStorage.setItem(INDEX_KEY, JSON.stringify(idx));
};

const makeId = () => `chira_${Date.now()}_${Math.random().toString(16).slice(2)}`;

const fileToCompressedJpegDataUrl = async (file: File): Promise<string> => {
  // 画像を読み込む
  const dataUrl: string = await new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result ?? ""));
    r.onerror = () => reject(new Error("failed to read file"));
    r.readAsDataURL(file);
  });

  const img: HTMLImageElement = await new Promise((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error("failed to load image"));
    i.src = dataUrl;
  });

  // ✅ 縮小（長辺MAX 1280）
  const maxSide = 1280;
  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;

  const scale = Math.min(1, maxSide / Math.max(w, h));
  const tw = Math.max(1, Math.round(w * scale));
  const th = Math.max(1, Math.round(h * scale));

  const canvas = document.createElement("canvas");
  canvas.width = tw;
  canvas.height = th;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas context unavailable");

  ctx.drawImage(img, 0, 0, tw, th);

  // ✅ JPEG圧縮（品質0.85）
  return canvas.toDataURL("image/jpeg", 0.85);
};

export async function saveChiraFromFile(file: File): Promise<string> {
  const id = makeId();
  const name = file.name || "image";
  const createdAt = Date.now();

  const jpegDataUrl = await fileToCompressedJpegDataUrl(file);

  const item: StoredChira = { id, name, createdAt, dataUrl: jpegDataUrl };

  // ✅ 容量オーバー等を捕捉できるようにする
  try {
    localStorage.setItem(ITEM_KEY_PREFIX + id, JSON.stringify(item));

    const idx = loadIndex();
    const next: ChiraMeta[] = [{ id, name, createdAt }, ...idx.filter((x) => x.id !== id)];
    saveIndex(next);
  } catch (e: any) {
    // ここで落ちるのがほぼ QuotaExceededError
    throw new Error("storage_full");
  }

  return id;
}

export function listChira(): Promise<ChiraMeta[]> {
  const idx = loadIndex().sort((a, b) => b.createdAt - a.createdAt);
  return Promise.resolve(idx);
}

export async function getChiraSrcById(id: string): Promise<string | null> {
  const raw = localStorage.getItem(ITEM_KEY_PREFIX + id);
  const item = safeJsonParse<StoredChira>(raw);
  if (item && typeof (item as any).dataUrl === "string") return item.dataUrl;
  return null; // ✅ 固定画像フォールバック廃止
}

export async function listChiraWithSrc(): Promise<(ChiraMeta & { src: string | null })[]> {
  const metas = await listChira();
  const out = await Promise.all(metas.map(async (m) => ({ ...m, src: await getChiraSrcById(m.id) })));
  return out;
}
