// app/ahatouch/_components/getImages.ts

export type AhaImage = {
  id: string;   // 例: "animals_010"
  src: string;  // 例: "/ahatouch/animals/animals_010.webp"
};

export function listImagesByCategory(catId: string): AhaImage[] {
  // public 配下を想定: /public/ahatouch/{cat}/xxx.webp
  // ※ ここは「列挙」だけ。ランダムは呼び出し側で。
  const base =
    catId === "animals"
      ? "/ahatouch/animals"
      : catId === "flowers"
      ? "/ahatouch/flowers"
      : "/ahatouch/world";

  // 例：animals_001.webp ～ animals_020.webp みたいな連番を想定
  // ここは君の実ファイル数に合わせて増減してOK
  const max =
    catId === "animals" ? 20 : catId === "flowers" ? 20 : 20;

  const pad3 = (n: number) => String(n).padStart(3, "0");

  return Array.from({ length: max }, (_, i) => {
    const no = i + 1;
    const id = `${catId}_${pad3(no)}`;
    return { id, src: `${base}/${id}.webp` };
  });
}

export function pickRandom(images: AhaImage[], count: number): AhaImage[] {
  if (!images.length) return [];
  const arr = [...images];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, Math.max(0, count));
}
// --- 互換（旧コード救済） ---
export const getRandomImages = (catId: string, count: number) => {
  const all = listImagesByCategory(catId);
  return pickRandom(all, count);
};
