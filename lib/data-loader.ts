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

// VR作品の型定義（R2から取得した生データ）
export interface VrWork {
  content_id: string;
  title: string;
  url: string;
  thumbnail_url: string;
  sample_images: string[] | null;
  price: number | string | null;
  list_price: number | string | null;
  campaign_title: string | null;
  campaign_end: string | null;
  actresses: string[];
  genres: string[];
  maker_name: string | null;
  release_date: string | null;
  duration_minutes: number | null;
  review_count: number | null;
  review_average: number | null;
  synopsis: string | null;
  ai_review: string | null;
}

// フロント用の型（既存のWork型と互換性のある形式）
export interface Work {
  id: string;
  title: string;
  thumbnailUrl: string;
  sampleImages: string[];
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
  vrType: string;
  genres: string[];
  summary: string;
  aiReview: string | null;
  fanzaUrl: string;
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
 * VrWorkをWork型に変換
 */
function convertToWork(vr: VrWork): Work {
  // 価格をパース
  const parsePrice = (p: number | string | null): number => {
    if (typeof p === "number") return p;
    if (typeof p === "string") {
      const match = p.match(/\d+/);
      return match ? Number.parseInt(match[0], 10) : 0;
    }
    return 0;
  };

  const price = parsePrice(vr.price);
  const listPrice = parsePrice(vr.list_price);

  // 割引率を計算
  let discountPercent = 0;
  if (listPrice > 0 && price < listPrice) {
    discountPercent = Math.round(((listPrice - price) / listPrice) * 100);
  }

  // キャンペーン終了日をフォーマット（例: "2026-02-01 15:00:00" → "2/1 15時まで"）
  let campaignEndDate: string | null = null;
  if (vr.campaign_end) {
    const endDate = new Date(vr.campaign_end);
    if (!Number.isNaN(endDate.getTime())) {
      const month = endDate.getMonth() + 1;
      const day = endDate.getDate();
      const hour = endDate.getHours();
      campaignEndDate = `${month}/${day} ${hour}時まで`;
    }
  }

  // 評価をパース
  let rating = 0;
  if (typeof vr.review_average === "number") {
    rating = vr.review_average;
  } else if (typeof vr.review_average === "string") {
    rating = Number.parseFloat(vr.review_average) || 0;
  }

  // 日付をフォーマット
  let releaseDate = "";
  if (vr.release_date) {
    const date = new Date(vr.release_date);
    releaseDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }

  // sample_imagesをパース（JSON文字列の場合がある）
  let sampleImages: string[] = [];
  if (vr.sample_images) {
    if (typeof vr.sample_images === "string") {
      try {
        sampleImages = JSON.parse(vr.sample_images);
      } catch {
        sampleImages = [];
      }
    } else if (Array.isArray(vr.sample_images)) {
      sampleImages = vr.sample_images;
    }
  }

  return {
    id: vr.content_id,
    title: vr.title,
    thumbnailUrl: vr.thumbnail_url,
    sampleImages,
    actresses: vr.actresses || [],
    maker: vr.maker_name || "",
    releaseDate,
    duration: vr.duration_minutes || 0,
    rating,
    reviewCount: vr.review_count || 0,
    price,
    listPrice,
    discountPercent,
    campaignTitle: vr.campaign_title || null,
    campaignEndDate,
    vrType: "VR",
    genres: vr.genres || [],
    summary: vr.synopsis || "",
    aiReview: vr.ai_review,
    fanzaUrl: vr.url,
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
  const vr = rawWorks.find((w) => w.content_id === contentId);
  return vr ? convertToWork(vr) : undefined;
}

/**
 * キャッシュをクリアする（テスト用）
 */
export function clearCache(): void {
  worksCache = null;
}
