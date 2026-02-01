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
  dataUrl: string;
};

const INDEX_KEY = "ahatouch_chira_index_v1";
const ITEM_KEY_PREFIX = "ahatouch_chira_item_v1:";

// 既存の固定画像も残す（フォールバック用）
export const chirarizumuStaticIds: string[] = [
  "animals_001","animals_002","animals_003",
  "animals_004","animals_005","animals_006",
  "animals_007","animals_008","animals_009",
];

const safeJsonParse = <T,>(raw: string | null): T | null => {
  if (!raw) return null;
  try { return JSON.parse(raw) as T; } catch { return null; }
};

const loadIndex = (): ChiraMeta[] => {
  const idx = safeJsonParse<ChiraMeta[]>(localStorage.getItem(INDEX_KEY));
  if (!idx || !Array.isArray(idx)) return [];
  return idx.filter(
    (x) => x && typeof (x as any).id === "string" && typeof (x as any).name === "string" && typeof (x as any).createdAt === "number"
  );
};

const saveIndex = (idx: ChiraMeta[]) => {
  localStorage.setItem(INDEX_KEY, JSON.stringify(idx));
};

const makeId = () => `chira_${Date.now()}_${Math.random().toString(16).slice(2)}`;

const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result ?? ""));
    r.onerror = () => reject(new Error("failed to read file"));
    r.readAsDataURL(file);
  });

export async function saveChiraFromFile(file: File): Promise<string> {
  const dataUrl = await readFileAsDataUrl(file);
  const id = makeId();
  const name = file.name || "image";
  const createdAt = Date.now();

  const item: StoredChira = { id, name, createdAt, dataUrl };
  localStorage.setItem(ITEM_KEY_PREFIX + id, JSON.stringify(item));

  const idx = loadIndex();
  const next: ChiraMeta[] = [{ id, name, createdAt }, ...idx.filter((x) => x.id !== id)];
  saveIndex(next);

  return id;
}

export function listChira(): Promise<ChiraMeta[]> {
  const idx = loadIndex().sort((a, b) => b.createdAt - a.createdAt);
  return Promise.resolve(idx);
}

export async function getChiraSrcById(id: string): Promise<string | null> {
  // まず保存済みを探す
  const raw = localStorage.getItem(ITEM_KEY_PREFIX + id);
  const item = safeJsonParse<StoredChira>(raw);
  if (item && typeof item.dataUrl === "string") return item.dataUrl;

  // なければ固定画像へフォールバック
  // public/ahatouch/chirarizumu/${id}.jpg を想定
  return `/ahatouch/chirarizumu/${id}.jpg`;
}

export async function listChiraWithSrc(): Promise<(ChiraMeta & { src: string | null })[]> {
  const metas = await listChira();
  const out = await Promise.all(metas.map(async (m) => ({ ...m, src: await getChiraSrcById(m.id) })));
  return out;
}
