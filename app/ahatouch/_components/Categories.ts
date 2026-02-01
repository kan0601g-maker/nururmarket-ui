// app/ahatouch/_components/Categories.ts
export type AhaCategory = {
  id: string;
  label: string;
  imageSrc: string;
};

export const AHA_CATEGORIES: AhaCategory[] = [
  { id: "animals", label: "動物" },
  { id: "flowers", label: "花" },
  { id: "world", label: "世界の風景" },
];

export const getCategory = (id: string | null | undefined) => {
  const key = (id ?? "").trim();
  return AHA_CATEGORIES.find((c) => c.id === key) ?? AHA_CATEGORIES[0];
};
