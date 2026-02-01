// app/ahatouch/_components/Categories.ts

export type AhaCategory = {
  id: string;
  label: string;
  imageSrc: string; // ★これが必要（quiz側で使ってる）
};

// ★ここは「imageSrc」を全要素に必ず入れる
export const AHA_CATEGORIES: AhaCategory[] = [
  {
    id: "animals",
    label: "動物",
    imageSrc: "/ahatouch/animals.jpg",
  },
  {
    id: "flowers",
    label: "花",
    imageSrc: "/ahatouch/flowers.jpg",
  },
  {
    id: "world",
    label: "世界の風景",
    imageSrc: "/ahatouch/world.jpg",
  },
];

// 既存コードがこれ系ならそのまま残す
export const getCategory = (id: string | null | undefined) => {
  const key = (id ?? "").trim();
  return AHA_CATEGORIES.find((c) => c.id === key) ?? null;
};
