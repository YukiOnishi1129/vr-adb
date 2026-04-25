import type { Work } from "./data-loader";

export interface FaqItem {
  question: string;
  answer: string;
}

function formatPrice(price: number): string {
  return `¥${price.toLocaleString()}`;
}

function formatDuration(minutes: number): string {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}時間${mins}分` : `${hours}時間`;
  }
  return `${minutes}分`;
}

// 作品詳細ページに表示するFAQ（FAQ Schema にも使う）
export function buildWorkFaq(work: Work): FaqItem[] {
  const faq: FaqItem[] = [];

  // 1. 価格・セール情報
  if (work.price > 0) {
    if (work.listPrice > 0 && work.price < work.listPrice) {
      const discount = work.listPrice - work.price;
      const percent = Math.round(((work.listPrice - work.price) / work.listPrice) * 100);
      faq.push({
        question: `「${work.title}」はセール中ですか？`,
        answer: `はい、現在${percent}%OFFのセール中です。通常価格${formatPrice(work.listPrice)}が${formatPrice(work.price)}で購入できます（${formatPrice(discount)}OFF）。${work.saleEndDate ? `セールは${work.saleEndDate}までです。` : ""}`,
      });
    } else {
      faq.push({
        question: `「${work.title}」の価格はいくらですか？`,
        answer: `本作品はFANZAで${formatPrice(work.price)}で購入できます。`,
      });
    }
  }

  // 2. 評価
  if (work.rating > 0 && work.reviewCount > 0) {
    faq.push({
      question: `「${work.title}」の評価はどうですか？`,
      answer: `本作品の評価は★${work.rating.toFixed(1)}（${work.reviewCount.toLocaleString()}件のレビュー）です。${
        work.rating >= 4.5
          ? "ユーザーから非常に高い評価を得ている人気作品です。"
          : work.rating >= 4.0
            ? "ユーザーから高評価を得ています。"
            : "詳細はサンプルや作品ページでご確認ください。"
      }`,
    });
  }

  // 3. 出演女優
  if (work.actresses && work.actresses.length > 0) {
    faq.push({
      question: `「${work.title}」の出演者は誰ですか？`,
      answer: `本作品には${work.actresses.join("、")}さんが出演しています。`,
    });
  }

  // 4. VR形式・対応デバイス
  if (work.vrType) {
    faq.push({
      question: `「${work.title}」はどんなVRデバイスで視聴できますか？`,
      answer: `本作品は${work.vrType}対応のVR動画です。Meta Quest、PSVR、PCVRなど、対応デバイスで視聴できます。詳細はFANZA作品ページの推奨環境をご確認ください。`,
    });
  }

  // 5. 収録時間
  if (work.duration > 0) {
    faq.push({
      question: `「${work.title}」の収録時間はどれくらいですか？`,
      answer: `本作品の収録時間は${formatDuration(work.duration)}です。`,
    });
  }

  // 6. ジャンル
  if (work.genres && work.genres.length > 0) {
    const tags = work.genres.slice(0, 5).join("、");
    faq.push({
      question: `「${work.title}」はどんなジャンルのVR作品ですか？`,
      answer: `本作品のジャンルは「${tags}」などです。アダルトVR動画として、没入感のある体験を楽しめます。`,
    });
  }

  // 7. メーカー
  if (work.maker) {
    faq.push({
      question: `「${work.title}」のメーカーはどこですか？`,
      answer: `本作品は${work.maker}が制作したVR作品です。`,
    });
  }

  return faq;
}
