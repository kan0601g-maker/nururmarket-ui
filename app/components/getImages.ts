/**
 * 指定カテゴリからランダムで画像パスを返す
 * @param category flowers / animals / world / nostalgia
 * @param total フォルダ内の総枚数（例：50）
 * @param count 使いたい枚数（例：25）
 */
export function getRandomImages(
  category: string,
  total: number,
  count: number
): string[] {
  const indices = Array.from({ length: total }, (_, i) => i + 1);

  // シャッフル
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  return indices.slice(0, count).map((n) => {
    const num = String(n).padStart(3, "0");
    return `/ahatouch/${category}/${category}_${num}.webp`;
  });
}
