// app/ahatouch/_components/chirarizumuImages.ts

export type ChirarizumuImage = {
  id: string;
  category: "animals" | "flowers" | "world";
  title?: string;
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
