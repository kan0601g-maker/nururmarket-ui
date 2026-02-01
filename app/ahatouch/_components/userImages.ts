// app/ahatouch/_components/userImages.ts
"use client";

export type UserImageMeta = {
  id: string;
  name: string;
  createdAt: number;
};

type StoredUserImage = {
  id: string;
  name: string;
  createdAt: number;
  dataUrl: string; // DataURL (base64)
};

const INDEX_KEY = "ahatouch_user_images_index_v1";
const ITEM_KEY_PREFIX = "ahatouch_user_image_v1:";

const safeJsonParse = <T,>(raw: string | null): T | null => {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

const loadIndex = (): UserImageMeta[] => {
  const idx = safeJsonParse<UserImageMeta[]>(localStorage.getItem(INDEX_KEY));
  if (!idx || !Array.isArray(idx)) return [];
  return idx.filter(
    (x) =>
      x &&
      typeof (x as any).id === "string" &&
      typeof (x as any).name === "string" &&
      typeof (x as any).createdAt === "number"
  );
};

const saveIndex = (idx: UserImageMeta[]) => {
  localStorage.setItem(INDEX_KEY, JSON.stringify(idx));
};

const makeId = () => `user_${Date.now()}_${Math.random().toString(16).slice(2)}`;

const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result ?? ""));
    r.onerror = () => reject(new Error("failed to read file"));
    r.readAsDataURL(file);
  });

export async function saveUserImageFromFile(file: File): Promise<string> {
  const dataUrl = await readFileAsDataUrl(file);
  const id = makeId();
  const name = file.name || "image";
  const createdAt = Date.now();

  const item: StoredUserImage = { id, name, createdAt, dataUrl };

  // save item
  localStorage.setItem(ITEM_KEY_PREFIX + id, JSON.stringify(item));

  // update index (newest first)
  const idx = loadIndex();
  const next: UserImageMeta[] = [{ id, name, createdAt }, ...idx.filter((x) => x.id !== id)];
  saveIndex(next);

  return id;
}

export function listUserImages(): Promise<UserImageMeta[]> {
  // newest first
  const idx = loadIndex().sort((a, b) => b.createdAt - a.createdAt);
  return Promise.resolve(idx);
}

export async function getUserImageSrcById(id: string): Promise<string | null> {
  const raw = localStorage.getItem(ITEM_KEY_PREFIX + id);
  const item = safeJsonParse<StoredUserImage>(raw);
  if (!item || typeof item.dataUrl !== "string") return null;
  return item.dataUrl;
}

/**
 * ✅ 一覧表示用：meta + src をまとめて返す（サムネ用）
 * ※ localStorageの画像が多いと重くなるので、必要なら将来「先頭N件だけ」も可能
 */
export async function listUserImagesWithSrc(): Promise<(UserImageMeta & { src: string | null })[]> {
  const metas = await listUserImages();
  const out = await Promise.all(metas.map(async (m) => ({ ...m, src: await getUserImageSrcById(m.id) })));
  return out;
}

// DataURL は revoke 不要。将来 objectURL にしても壊れないよう関数だけ残す。
export function revokeUrl(_url: string): void {
  // no-op
}
