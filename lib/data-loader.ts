/**
 * VR-ADB データローダー
 *
 * prebuild-data.mjsで生成されたJSONキャッシュからデータを読み込む。
 * ビルド時に一度だけ読み込んでメモリにキャッシュする。
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

// キャッシュディレクトリのパス
const CACHE_DIR = join(process.cwd(), ".cache/data");

// キャッシュ用
let worksCache: VrWork[] | null = null;

// VR作品の型定義（R2 Parquetから取得した生データ）
export interface VrWork {
  id: number;
  maker_id: number | null;
  title: string;
  fanza_product_id: string;
  fanza_url: string;
  thumbnail_url: string;
  sample_images: string[] | null;
  sample_movie_url: string | null;
  description: string | null;
  release_date: string | null;
  duration_minutes: number | null;
  vr_type: string | null;
  supported_devices: string[] | null;
  price: number | null;
  sale_price: number | null;
  discount_rate: number | null;
  coupon_amount: number | null;
  sale_end_date: string | null;
  is_on_sale: number;
  ranking_position: number | null;
  rating: number | null;
  review_count: number | null;
  review_comment_count: number | null;
  user_reviews: unknown[] | null;
  // AI生成コンテンツ
  ai_review: string | null;
  ai_summary: string | null;
  ai_recommend_reason: string | null;
  ai_appeal_points: string | null;
  ai_target_audience: string | null;
  ai_warnings: string | null;
  ai_tags: string[] | null;
  // タグ・属性
  actress_names: string[] | null;
  genres: string[] | null;
  fetish_tags: string[] | null;
  situations: string[] | null;
  is_summarized: number;
  is_available: number;
  created_at: string;
  updated_at: string;
}

// フロント用の型（2d-adb互換）
export interface Work {
  id: string;
  title: string;
  thumbnailUrl: string;
  sampleImages: string[];
  description: string | null;
  actresses: string[];
  maker: string;
  releaseDate: string;
  duration: number;
  rating: number;
  reviewCount: number;
  price: number;
  listPrice: number;
  discountPercent: number;
  campaignTitle: string | null;
  campaignEndDate: string | null;
  saleEndDate: string | null;
  vrType: string;
  genres: string[];
  // AI生成コンテンツ（2d-adb互換）
  aiReview: string | null;
  aiSummary: string | null;
  aiRecommendReason: string | null;
  aiAppealPoints: string | null;
  aiTargetAudience: string | null;
  aiWarnings: string | null;
  aiTags: string[];
  // VR特有
  fetishTags: string[];
  situations: string[];
  fanzaUrl: string;
  rankingPosition: number | null;
}

/**
 * JSONキャッシュファイルを読み込む
 */
function loadJson<T>(filename: string): T[] {
  const filePath = join(CACHE_DIR, filename);
  if (!existsSync(filePath)) {
    console.warn(`Cache file not found: ${filePath}`);
    return [];
  }
  const content = readFileSync(filePath, "utf-8");
  return JSON.parse(content) as T[];
}

/**
 * JSON配列をパースするヘルパー関数
 */
function parseJsonArray(data: unknown): string[] {
  if (!data) return [];
  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return Array.isArray(data) ? data : [];
}

/**
 * VrWorkをWork型に変換
 */
function convertToWork(vr: VrWork): Work {
  // 価格
  const price = vr.sale_price || vr.price || 0;
  const listPrice = vr.price || 0;

  // 割引率
  let discountPercent = vr.discount_rate || 0;
  if (!discountPercent && listPrice > 0 && price < listPrice) {
    discountPercent = Math.round(((listPrice - price) / listPrice) * 100);
  }

  // セール終了日をフォーマット
  let campaignEndDate: string | null = null;
  if (vr.sale_end_date) {
    const endDate = new Date(vr.sale_end_date);
    if (!Number.isNaN(endDate.getTime())) {
      const month = endDate.getMonth() + 1;
      const day = endDate.getDate();
      const hour = endDate.getHours();
      campaignEndDate = `${month}/${day} ${hour}時まで`;
    }
  }

  // 日付をフォーマット
  let releaseDate = "";
  if (vr.release_date) {
    const date = new Date(vr.release_date);
    releaseDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }

  // 配列フィールドをパース
  const sampleImages = parseJsonArray(vr.sample_images);
  const actresses = parseJsonArray(vr.actress_names);
  const genres = parseJsonArray(vr.genres);
  const aiTags = parseJsonArray(vr.ai_tags);
  const fetishTags = parseJsonArray(vr.fetish_tags);
  const situations = parseJsonArray(vr.situations);

  return {
    id: vr.fanza_product_id,
    title: vr.title,
    thumbnailUrl: vr.thumbnail_url || "",
    sampleImages,
    description: vr.description,
    actresses,
    maker: "", // TODO: makers.jsonからmaker_idで取得
    releaseDate,
    duration: vr.duration_minutes || 0,
    rating: vr.rating || 0,
    reviewCount: vr.review_count || 0,
    price,
    listPrice,
    discountPercent,
    campaignTitle: vr.is_on_sale ? "セール中" : null,
    campaignEndDate,
    saleEndDate: vr.sale_end_date,
    vrType: vr.vr_type || "VR",
    genres,
    // AI生成コンテンツ
    aiReview: vr.ai_review,
    aiSummary: vr.ai_summary,
    aiRecommendReason: vr.ai_recommend_reason,
    aiAppealPoints: vr.ai_appeal_points,
    aiTargetAudience: vr.ai_target_audience,
    aiWarnings: vr.ai_warnings,
    aiTags,
    // VR特有
    fetishTags,
    situations,
    fanzaUrl: vr.fanza_url || "",
    rankingPosition: vr.ranking_position,
  };
}

/**
 * 生データを取得（キャッシュ付き）
 */
async function getRawWorks(): Promise<VrWork[]> {
  if (worksCache === null) {
    worksCache = loadJson<VrWork>("works.json");
    console.log(`Loaded ${worksCache.length} VR works from cache`);
  }
  return worksCache;
}

/**
 * 作品データを取得（Work型）
 */
export async function getWorks(): Promise<Work[]> {
  const rawWorks = await getRawWorks();
  return rawWorks.map(convertToWork);
}

/**
 * 作品IDで取得
 */
export async function getWorkById(contentId: string): Promise<Work | undefined> {
  const rawWorks = await getRawWorks();
  const vr = rawWorks.find((w) => w.fanza_product_id === contentId);
  return vr ? convertToWork(vr) : undefined;
}

/**
 * キャッシュをクリアする（テスト用）
 */
export function clearCache(): void {
  worksCache = null;
}

// 女優/ジャンル情報の型
export interface ActressInfo {
  name: string;
  workCount: number;
  thumbnailUrl: string; // 代表作品のサムネイル
}

export interface GenreInfo {
  name: string;
  workCount: number;
  thumbnailUrl: string;
}

/**
 * 女優一覧を取得（作品数降順）
 */
export async function getActresses(): Promise<ActressInfo[]> {
  const works = await getWorks();
  const actressMap = new Map<string, { count: number; thumbnailUrl: string }>();

  for (const work of works) {
    for (const actress of work.actresses) {
      if (!actress) continue;
      const existing = actressMap.get(actress);
      if (existing) {
        existing.count++;
      } else {
        actressMap.set(actress, { count: 1, thumbnailUrl: work.thumbnailUrl });
      }
    }
  }

  return Array.from(actressMap.entries())
    .map(([name, data]) => ({
      name,
      workCount: data.count,
      thumbnailUrl: data.thumbnailUrl,
    }))
    .sort((a, b) => b.workCount - a.workCount);
}

/**
 * 特定の女優の作品を取得
 */
export async function getWorksByActress(actressName: string): Promise<Work[]> {
  const works = await getWorks();
  return works.filter((work) => work.actresses.includes(actressName));
}

/**
 * ジャンル一覧を取得（作品数降順）
 */
export async function getGenres(): Promise<GenreInfo[]> {
  const works = await getWorks();
  const genreMap = new Map<string, { count: number; thumbnailUrl: string }>();

  for (const work of works) {
    for (const genre of work.genres) {
      if (!genre) continue;
      const existing = genreMap.get(genre);
      if (existing) {
        existing.count++;
      } else {
        genreMap.set(genre, { count: 1, thumbnailUrl: work.thumbnailUrl });
      }
    }
  }

  return Array.from(genreMap.entries())
    .map(([name, data]) => ({
      name,
      workCount: data.count,
      thumbnailUrl: data.thumbnailUrl,
    }))
    .sort((a, b) => b.workCount - a.workCount);
}

/**
 * 特定のジャンルの作品を取得
 */
export async function getWorksByGenre(genreName: string): Promise<Work[]> {
  const works = await getWorks();
  return works.filter((work) => work.genres.includes(genreName));
}

/**
 * ランキング順で作品を取得
 */
export async function getWorksByRanking(): Promise<Work[]> {
  const works = await getWorks();
  return works
    .filter((work) => work.rankingPosition !== null)
    .sort((a, b) => (a.rankingPosition || 999) - (b.rankingPosition || 999));
}

/**
 * セール中の作品を取得
 */
export async function getSaleWorks(): Promise<Work[]> {
  const works = await getWorks();
  return works.filter((work) => work.discountPercent > 0);
}

/**
 * 同じ女優の作品を取得（自分自身を除く）
 */
export async function getWorksByActressExcluding(
  actressName: string,
  excludeId: string,
  limit = 4
): Promise<Work[]> {
  const works = await getWorks();
  return works
    .filter((work) => work.id !== excludeId && work.actresses.includes(actressName))
    .slice(0, limit);
}

/**
 * タグベースで似た作品を取得
 */
export async function getSimilarWorks(
  currentWork: Work,
  limit = 4
): Promise<Work[]> {
  const works = await getWorks();
  const currentTags = [...currentWork.aiTags, ...currentWork.genres];

  // スコア計算：共通タグの数
  const scored = works
    .filter((work) => work.id !== currentWork.id)
    .map((work) => {
      const workTags = [...work.aiTags, ...work.genres];
      const commonTags = currentTags.filter((tag) => workTags.includes(tag));
      return { work, score: commonTags.length };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((item) => item.work);
}

/**
 * 人気作品を取得（ランキング上位 or 評価順）
 */
export async function getPopularWorks(
  excludeId: string,
  limit = 4
): Promise<Work[]> {
  const works = await getWorks();
  return works
    .filter((work) => work.id !== excludeId)
    .sort((a, b) => {
      // ランキングがあればそれを優先
      if (a.rankingPosition && b.rankingPosition) {
        return a.rankingPosition - b.rankingPosition;
      }
      if (a.rankingPosition) return -1;
      if (b.rankingPosition) return 1;
      // なければ評価順
      return b.rating - a.rating;
    })
    .slice(0, limit);
}

/**
 * 高評価作品を取得（指定評価以上）
 */
export async function getHighRatedWorks(
  minRating = 4.5,
  limit = 12
): Promise<Work[]> {
  const works = await getWorks();
  return works
    .filter((work) => work.rating >= minRating)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

/**
 * バーゲン作品を取得（指定価格以下）
 */
export async function getBargainWorks(
  maxPrice = 500,
  limit = 12
): Promise<Work[]> {
  const works = await getWorks();
  return works
    .filter((work) => work.price > 0 && work.price <= maxPrice)
    .sort((a, b) => a.price - b.price)
    .slice(0, limit);
}

/**
 * 新着作品を取得（リリース日順）
 */
export async function getNewWorks(limit = 12): Promise<Work[]> {
  const works = await getWorks();
  return works
    .filter((work) => work.releaseDate)
    .sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))
    .slice(0, limit);
}

/**
 * 特定ジャンルのランキング作品を取得
 */
export async function getGenreRankingWorks(
  genreName: string,
  limit = 12
): Promise<Work[]> {
  const works = await getWorks();
  return works
    .filter((work) => work.genres.includes(genreName))
    .sort((a, b) => {
      if (a.rankingPosition && b.rankingPosition) {
        return a.rankingPosition - b.rankingPosition;
      }
      if (a.rankingPosition) return -1;
      if (b.rankingPosition) return 1;
      return b.rating - a.rating;
    })
    .slice(0, limit);
}
