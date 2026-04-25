import type { Work } from "./data-loader";

// FANZA動画 GOLDEN WEEK 50%OFFキャンペーン
// 詳細: https://video.dmm.co.jp/feature/half/
// 対象作品の判別: タイトルに「【50%OFFキャンペーン第○弾】」の表記がついた作品

const GW_CAMPAIGN_LANDING_URL = "https://video.dmm.co.jp/feature/half/";
const FANZA_AFFILIATE_ID = "monodata-991";

// キャンペーン全体の終了日（最終弾の終了 = 第11弾 2026/05/15 09:59）
// この日時を過ぎたらバッジ・バナーともに非表示
const CAMPAIGN_END = new Date("2026-05-15T09:59:00+09:00");

// 各弾の期間定義（参考用、現在の弾を表示したい場合に使用）
interface CampaignWave {
  wave: number;
  start: Date;
  end: Date;
}

const CAMPAIGN_WAVES: CampaignWave[] = [
  { wave: 1, start: new Date("2026-04-17T10:00:00+09:00"), end: new Date("2026-04-20T09:59:00+09:00") },
  { wave: 2, start: new Date("2026-04-20T10:10:00+09:00"), end: new Date("2026-04-22T09:59:00+09:00") },
  { wave: 3, start: new Date("2026-04-22T10:10:00+09:00"), end: new Date("2026-04-24T09:59:00+09:00") },
  { wave: 4, start: new Date("2026-04-24T10:10:00+09:00"), end: new Date("2026-04-27T09:59:00+09:00") },
  { wave: 5, start: new Date("2026-04-27T10:10:00+09:00"), end: new Date("2026-04-29T09:59:00+09:00") },
  { wave: 6, start: new Date("2026-04-29T10:10:00+09:00"), end: new Date("2026-05-01T09:59:00+09:00") },
  { wave: 7, start: new Date("2026-05-01T10:10:00+09:00"), end: new Date("2026-05-06T09:59:00+09:00") },
  { wave: 8, start: new Date("2026-05-06T10:10:00+09:00"), end: new Date("2026-05-08T09:59:00+09:00") },
  { wave: 9, start: new Date("2026-05-08T10:10:00+09:00"), end: new Date("2026-05-11T09:59:00+09:00") },
  { wave: 10, start: new Date("2026-05-11T10:10:00+09:00"), end: new Date("2026-05-13T09:59:00+09:00") },
  { wave: 11, start: new Date("2026-05-13T10:10:00+09:00"), end: new Date("2026-05-15T09:59:00+09:00") },
];

// キャンペーン全体が現時点で有効か
export function isGwCampaignActive(now: Date = new Date()): boolean {
  return now.getTime() <= CAMPAIGN_END.getTime();
}

// 現在進行中の弾を返す（無ければ null）
export function getCurrentWave(now: Date = new Date()): CampaignWave | null {
  for (const w of CAMPAIGN_WAVES) {
    if (now.getTime() >= w.start.getTime() && now.getTime() <= w.end.getTime()) {
      return w;
    }
  }
  return null;
}

// タイトルに「【50%OFFキャンペーン第○弾】」が含まれるか判定
const GW_TITLE_PATTERN = /【50%OFFキャンペーン第\d+弾】/;

export function isGwCampaignWork(work: Work): boolean {
  if (!isGwCampaignActive()) return false;
  if (!work.title) return false;
  return GW_TITLE_PATTERN.test(work.title);
}

// アフィリエイトリダイレクト経由のキャンペーン特集ページURL
// ch=toolbar&ch_id=link は DMM公式ツールバーの正規フォーマット
export function getGwCampaignAffiliateUrl(): string {
  return `https://al.fanza.co.jp/?lurl=${encodeURIComponent(GW_CAMPAIGN_LANDING_URL)}&af_id=${FANZA_AFFILIATE_ID}&ch=toolbar&ch_id=link`;
}
