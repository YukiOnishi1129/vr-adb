// モックデータ（FANZAアフィリエイト申請用）

export interface Work {
  id: number;
  title: string;
  thumbnailUrl: string;
  actresses: string[];
  maker: string;
  releaseDate: string;
  duration: number;
  rating: number;
  reviewCount: number;
  price: number;
  discountRate?: number;
  saleEndDate?: string;
  vrType: string;
  genres: string[];
  summary: string;
}

export const mockWorks: Work[] = [
  {
    id: 1,
    title: "【VR】美人OLと朝から晩まで濃密セックス 完全主観で味わう極上体験",
    thumbnailUrl: "https://placehold.co/320x180/1a1a1a/ec4899?text=VR+Sample+1",
    actresses: ["美咲かんな"],
    maker: "PREMIUM VR",
    releaseDate: "2026-01-20",
    duration: 120,
    rating: 4.8,
    reviewCount: 256,
    price: 2980,
    discountRate: 30,
    saleEndDate: "2026-01-31",
    vrType: "8K VR",
    genres: ["OL", "主観", "中出し"],
    summary:
      "美人OLとの濃密な一日を完全主観で体験できるVR作品。朝のキスから始まり、オフィスでの秘密の関係、そして夜の情熱的なセックスまで、リアルな没入感で楽しめます。",
  },
  {
    id: 2,
    title: "【VR】隣の人妻と禁断の不倫SEX 旦那が出張中に...",
    thumbnailUrl: "https://placehold.co/320x180/1a1a1a/ec4899?text=VR+Sample+2",
    actresses: ["篠田ゆう"],
    maker: "熟女VR",
    releaseDate: "2026-01-18",
    duration: 95,
    rating: 4.6,
    reviewCount: 189,
    price: 2480,
    vrType: "高画質VR",
    genres: ["人妻", "不倫", "NTR"],
    summary:
      "隣に住む美人妻との禁断の関係を描いたVR作品。旦那が出張中、寂しさを紛らわせるために訪れた彼女との背徳的な時間。",
  },
  {
    id: 3,
    title: "【VR】エステサロンで極上マッサージ 巨乳エステティシャンの誘惑",
    thumbnailUrl: "https://placehold.co/320x180/1a1a1a/ec4899?text=VR+Sample+3",
    actresses: ["三上悠亜"],
    maker: "S1 VR",
    releaseDate: "2026-01-15",
    duration: 110,
    rating: 4.9,
    reviewCount: 342,
    price: 3480,
    discountRate: 50,
    saleEndDate: "2026-02-05",
    vrType: "8K VR",
    genres: ["エステ", "巨乳", "痴女"],
    summary:
      "高級エステサロンで受ける極上のマッサージ体験。巨乳エステティシャンの柔らかな手つきと誘惑的な視線に、次第に理性が崩れていく...",
  },
  {
    id: 4,
    title: "【VR】女子校生と放課後の秘密 教室で二人きりの時間",
    thumbnailUrl: "https://placehold.co/320x180/1a1a1a/ec4899?text=VR+Sample+4",
    actresses: ["橋本ありな"],
    maker: "MOODYZ VR",
    releaseDate: "2026-01-12",
    duration: 85,
    rating: 4.7,
    reviewCount: 215,
    price: 2780,
    vrType: "高画質VR",
    genres: ["制服", "学園", "純愛"],
    summary:
      "放課後の教室で始まる甘酸っぱい青春ラブストーリー。制服姿の彼女との初々しいイチャイチャから、徐々にエスカレートしていく関係を体験。",
  },
  {
    id: 5,
    title: "【VR】痴漢電車 満員電車で密着する美女たち",
    thumbnailUrl: "https://placehold.co/320x180/1a1a1a/ec4899?text=VR+Sample+5",
    actresses: ["深田えいみ", "波多野結衣"],
    maker: "痴漢VR",
    releaseDate: "2026-01-10",
    duration: 100,
    rating: 4.5,
    reviewCount: 178,
    price: 2680,
    discountRate: 20,
    saleEndDate: "2026-01-28",
    vrType: "VR専用",
    genres: ["痴漢", "電車", "複数プレイ"],
    summary:
      "満員電車という密閉空間で繰り広げられる背徳的な体験。複数の美女たちとの同時密着が楽しめる贅沢なVR作品。",
  },
  {
    id: 6,
    title: "【VR】温泉旅館で女将さんと 和服美人との一夜",
    thumbnailUrl: "https://placehold.co/320x180/1a1a1a/ec4899?text=VR+Sample+6",
    actresses: ["白石茉莉奈"],
    maker: "熟女VR",
    releaseDate: "2026-01-08",
    duration: 130,
    rating: 4.4,
    reviewCount: 145,
    price: 2980,
    vrType: "高画質VR",
    genres: ["和服", "熟女", "旅館"],
    summary:
      "温泉旅館を舞台にした大人のロマンス。和服姿の美人女将との夜の営みを、情緒あふれる和室で体験できます。",
  },
];

export const mockActresses = [
  {
    name: "三上悠亜",
    workCount: 45,
    thumbnail: "https://placehold.co/100x100/1a1a1a/ec4899?text=Actress+1",
  },
  {
    name: "橋本ありな",
    workCount: 38,
    thumbnail: "https://placehold.co/100x100/1a1a1a/ec4899?text=Actress+2",
  },
  {
    name: "深田えいみ",
    workCount: 52,
    thumbnail: "https://placehold.co/100x100/1a1a1a/ec4899?text=Actress+3",
  },
  {
    name: "篠田ゆう",
    workCount: 41,
    thumbnail: "https://placehold.co/100x100/1a1a1a/ec4899?text=Actress+4",
  },
  {
    name: "波多野結衣",
    workCount: 67,
    thumbnail: "https://placehold.co/100x100/1a1a1a/ec4899?text=Actress+5",
  },
];

export const mockGenres = [
  { name: "主観", count: 234 },
  { name: "痴女", count: 189 },
  { name: "巨乳", count: 312 },
  { name: "人妻", count: 267 },
  { name: "NTR", count: 145 },
  { name: "制服", count: 198 },
  { name: "痴漢", count: 87 },
  { name: "エステ", count: 112 },
];
