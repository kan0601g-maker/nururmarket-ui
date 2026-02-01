export type StoredImage = {
  id: string;
  name: string;
  createdAt: number;
  type: string;
  size: number;
};

const LS_KEY = "ahatouch_user_images_meta_v1";

// ===== UUID生成（安全フォールバック） =====
const makeId = () => {
  try {
    const c: any = (globalThis as any).crypto;
    if (c && typeof c.randomUUID === "function") return c.randomUUID();
  } catch {}

  try {
    const c: any = (globalThis as any).crypto;
    if (c && typeof c.getRandomValues === "function") {
      const bytes = new Uint8Array(16);
      c.getRandomValues(bytes);
      bytes[6] = (bytes[6] & 0x0f) | 0x40;
      bytes[8] = (bytes[8] & 0x3f) | 0x80;
      const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
      return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(
        16,
        20
      )}-${hex.slice(20)}`;
    }
  } catch {}

  return `id_${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

// ===== localStorage（meta） =====
const safeParse = (raw: string | null): StoredImage[] => {
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr
      .map((x) => ({
        id: String(x.id ?? ""),
        name: String(x.name ?? "image"),
        createdAt: Number(x.createdAt ?? Date.now()),
        type: String(x.type ?? "image/jpeg"),
        size: Number(x.size ?? 0),
      }))
      .filter((x) => x.id);
  } catch {
    return [];
  }
};

const saveAllMeta = (images: StoredImage[]) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(images));
  } catch {}
};

export const listUserImages = (): StoredImage[] => {
  if (typeof window === "undefined") return [];
  return safeParse(localStorage.getItem(LS_KEY)).sort(
    (a, b) => b.createdAt - a.createdAt
  );
};

// ===== IndexedDB（素のIndexedDB用・正規Promise） =====
const DB_NAME = "ahatouch_db_v2";
const DB_VERSION = 3; // ★ここが重要（upgrade強制）
const STORE = "images";

const openDB = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains("images")) {
        db.createObjectStore("images", { keyPath: "id" });
      }
      // chirarizumu側のstoreも同DBで作っておく（衝突防止）
      if (!db.objectStoreNames.contains("chirarizumu_images")) {
        db.createObjectStore("chirarizumu_images", { keyPath: "id" });
      }
    };

    req.onsuccess = () => {
      const db = req.result;

      // ★古いDB（store欠け）を握ったらここで検知して落とす
      const need = ["images", "chirarizumu_images"];
      for (const s of need) {
        if (!db.objectStoreNames.contains(s)) {
          db.close();
          reject(new Error(`object store missing: ${s}`));
          return;
        }
      }
      resolve(db);
    };

    req.onerror = () => reject(req.error ?? new Error("indexedDB open failed"));
  });

const waitTx = (tx: IDBTransaction) =>
  new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("tx error"));
    tx.onabort = () => reject(tx.error ?? new Error("tx abort"));
  });

const reqToPromise = <T>(req: IDBRequest<T>) =>
  new Promise<T>((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error("request error"));
  });

const putBlob = async (id: string, blob: Blob, type: string, createdAt: number) => {
  const db = await openDB();
  const tx = db.transaction(STORE, "readwrite");
  const store = tx.objectStore(STORE);

  store.put({ id, blob, type, createdAt });

  await waitTx(tx);
  db.close();
};

const getBlob = async (id: string): Promise<Blob | null> => {
  const db = await openDB();
  const tx = db.transaction(STORE, "readonly");
  const store = tx.objectStore(STORE);

  const res: any = await reqToPromise(store.get(id));
  db.close();

  return res?.blob instanceof Blob ? (res.blob as Blob) : null;
};

const clearAllBlobs = async () => {
  const db = await openDB();
  const tx = db.transaction(STORE, "readwrite");
  const store = tx.objectStore(STORE);

  store.clear();

  await waitTx(tx);
  db.close();
};

// ===== API =====
export const addUserImages = async (
  files: FileList | File[]
): Promise<StoredImage[]> => {
  if (typeof window === "undefined") return [];

  const arr = Array.from(files as any).filter(Boolean) as File[];
  if (arr.length === 0) return [];

  const current = listUserImages();
  const added: StoredImage[] = [];

  for (const f of arr) {
    if (!f.type.startsWith("image/")) continue;

    const id = makeId();
    const createdAt = Date.now();
    const blob = f;

    await putBlob(id, blob, f.type || "image/jpeg", createdAt);

    added.push({
      id,
      name: f.name || "image",
      createdAt,
      type: f.type || "image/jpeg",
      size: blob.size ?? f.size ?? 0,
    });
  }

  saveAllMeta([...added, ...current]);
  return added;
};

export const clearUserImages = async () => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(LS_KEY);
  } catch {}
  await clearAllBlobs();
};

export const getUserImageSrcById = async (id: string): Promise<string | null> => {
  if (!id) return null;
  const blob = await getBlob(id);
  if (!blob) return null;
  return URL.createObjectURL(blob);
};

export const revokeUrl = (url: string) => {
  try {
    if (typeof url === "string" && url.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }
  } catch {}
};
