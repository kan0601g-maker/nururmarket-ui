// app/ahatouch/_components/userImages.ts
export type UserImageMeta = {
  id: string;
  createdAt: number;
};

const META_KEY = "ahatouch:userImages:meta";
const DATA_PREFIX = "ahatouch:userImages:data:"; // + id

function uid() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function readMeta(): UserImageMeta[] {
  try {
    const raw = localStorage.getItem(META_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function writeMeta(items: UserImageMeta[]) {
  localStorage.setItem(META_KEY, JSON.stringify(items));
}

async function fileToDataUrl(file: File): Promise<string> {
  return await new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(new Error("FileReader failed"));
    r.readAsDataURL(file);
  });
}

// ✅ 取り込み（File → DataURL を localStorage へ）
export async function saveUserImageFromFile(file: File): Promise<string> {
  const id = uid();
  const dataUrl = await fileToDataUrl(file);

  localStorage.setItem(DATA_PREFIX + id, dataUrl);

  const meta = readMeta();
  meta.unshift({ id, createdAt: Date.now() });
  writeMeta(meta);

  return id;
}

// ✅ 一覧
export async function listUserImages(): Promise<UserImageMeta[]> {
  return readMeta();
}

// ✅ 1枚取得（DataURLを返す）
// ※ Next の build/SSRでも呼ばれうるので、呼び出し側は client のみで使うこと
export async function getUserImageSrcById(id: string): Promise<string | null> {
  if (!id) return null;
  const dataUrl = localStorage.getItem(DATA_PREFIX + id);
  return dataUrl ?? null;
}

// ✅ DataURLは revoke 不要。将来 blob URL にした時のために残すだけ
export function revokeUrl(_url: string) {
  // no-op
}
