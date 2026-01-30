// 検索インデックスの型（軽量化のため短いキー名を使用）
export type SearchItem = {
  id: string; // fanza_product_id
  t: string; // タイトル
  ac: string[]; // 女優リスト
  g: string[]; // ジャンルリスト
  mk: string; // メーカー
  p: number; // 現在価格
  lp: number; // 定価
  dr: number | null; // 割引率
  img: string; // サムネイルURL
  rt: number | null; // 評価
  rc: number | null; // レビュー件数
  rel: string; // 配信日
  dur: number | null; // 再生時間（分）
  rk: number | null; // ランキング順位
};

// 簡易検索（サジェスト用）
export function searchItems(items: SearchItem[], query: string): SearchItem[] {
  if (!query.trim()) {
    return [];
  }

  const q = query.toLowerCase();
  const terms = q.split(/\s+/).filter((t) => t.length > 0);

  return items
    .filter((item) => {
      const searchableText = [
        item.t,
        ...item.ac,
        ...item.g,
        item.mk,
      ]
        .join(" ")
        .toLowerCase();

      // 全ての検索語が含まれているかチェック（AND検索）
      return terms.every((term) => searchableText.includes(term));
    })
    .slice(0, 50); // 最大50件
}
