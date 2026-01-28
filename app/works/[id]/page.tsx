import {
  Calendar,
  ChevronRight,
  Clock,
  ExternalLink,
  Star,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { getWorks, getWorkById } from "@/lib/data-loader";

export async function generateStaticParams() {
  const works = await getWorks();
  return works.map((work) => ({
    id: work.id,
  }));
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const work = await getWorkById(id);

  if (!work) {
    notFound();
  }

  // セール中かどうか（price < listPrice）
  const isOnSale = work.listPrice > 0 && work.price < work.listPrice;

  // 星評価を生成するヘルパー関数
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`star-full-${i}`} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
      );
    }
    if (hasHalfStar) {
      stars.push(
        <Star key="star-half" className="h-4 w-4 fill-yellow-500/50 text-yellow-500" />
      );
    }
    const emptyCount = 5 - stars.length;
    for (let i = 0; i < emptyCount; i++) {
      stars.push(
        <Star key={`star-empty-${i}`} className="h-4 w-4 text-gray-300" />
      );
    }

    return <span className="inline-flex items-center">{stars}</span>;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* セールヘッダーバナー（ヘッダーの下に固定） */}
      {isOnSale && work.discountPercent > 0 && (
        <div className="fixed left-0 right-0 top-14 z-40 flex items-center justify-center gap-3 bg-red-600 py-2 text-white">
          <span className="rounded bg-white px-2 py-0.5 text-sm font-bold text-red-600">
            {work.discountPercent}%OFF
          </span>
          <span className="text-sm font-medium">
            終了まで {work.campaignEndDate || "期間限定"}
          </span>
        </div>
      )}

      {/* セールバナー分のスペーサー */}
      {isOnSale && work.discountPercent > 0 && <div className="h-10" />}

      <main className="mx-auto max-w-5xl px-4 py-6 pb-24 lg:pb-6">
        {/* パンくず */}
        <nav className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            トップ
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{work.title.slice(0, 20)}...</span>
        </nav>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* メインコンテンツ */}
          <div className="lg:col-span-2">
            {/* サムネイル */}
            <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
              <img
                src={work.thumbnailUrl}
                alt={work.title}
                className="h-full w-full object-cover"
              />
              {isOnSale && work.discountPercent > 0 && (
                <div className="absolute left-3 top-3 rounded bg-red-600 px-3 py-1 text-sm font-bold text-white">
                  {work.discountPercent}%OFF
                </div>
              )}
              <div className="absolute bottom-3 right-3 rounded bg-black/70 px-3 py-1 text-sm text-white">
                {work.vrType}
              </div>
            </div>

            {/* タイトル */}
            <h1 className="mt-4 text-xl font-bold leading-tight md:text-2xl">
              {work.title}
            </h1>

            {/* ファーストビューCTA */}
            <div className="mt-4 rounded-lg border border-border bg-card p-4">
              {/* セール情報バナー */}
              {isOnSale && work.discountPercent > 0 && (
                <div className="mb-3 flex items-center justify-center gap-2 rounded bg-red-600/10 py-2">
                  <span className="rounded bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
                    {work.discountPercent}%OFF
                  </span>
                  <span className="text-sm font-medium text-red-600">
                    今だけの特別価格！
                  </span>
                </div>
              )}

              {/* 評価 */}
              {work.rating > 0 && (
                <div className="flex items-center justify-center gap-2">
                  {renderStars(work.rating)}
                  <span className="text-lg font-bold">{work.rating.toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground">
                    ({work.reviewCount}件のレビュー)
                  </span>
                </div>
              )}

              {/* 価格 */}
              <div className="mt-3 text-center">
                {isOnSale ? (
                  <div>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-muted-foreground line-through">
                        ¥{work.listPrice.toLocaleString()}
                      </span>
                      <span className="text-2xl font-bold text-red-500">
                        ¥{work.price.toLocaleString()}〜
                      </span>
                    </div>
                    {work.campaignEndDate && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {work.campaignEndDate}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-2xl font-bold">
                    {work.price > 0 ? `¥${work.price.toLocaleString()}〜` : "価格を確認"}
                  </div>
                )}
              </div>

              {/* 購入ボタン */}
              <a
                href={work.fanzaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-bold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                FANZAで購入
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            {/* 再生時間・配信日 */}
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {work.duration > 0 && (
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {work.duration}分
                </span>
              )}
              {work.releaseDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {work.releaseDate}
                </span>
              )}
            </div>

            {/* 出演者・メーカー */}
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              {work.actresses.length > 0 && (
                <div>
                  <span className="text-muted-foreground">出演：</span>
                  {work.actresses.map((actress, i) => (
                    <span key={actress}>
                      <Link
                        href={`/actresses/${encodeURIComponent(actress)}`}
                        className="text-primary hover:underline"
                      >
                        {actress}
                      </Link>
                      {i < work.actresses.length - 1 && "、"}
                    </span>
                  ))}
                </div>
              )}
              {work.maker && (
                <div>
                  <span className="text-muted-foreground">メーカー：</span>
                  <span>{work.maker}</span>
                </div>
              )}
            </div>

            {/* ジャンル */}
            {work.genres.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {work.genres.map((genre) => (
                  <Link
                    key={genre}
                    href={`/genres/${encodeURIComponent(genre)}`}
                    className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm hover:bg-secondary/80"
                  >
                    <Tag className="h-3 w-3" />
                    {genre}
                  </Link>
                ))}
              </div>
            )}

            {/* AI体験レポ（画像を合間に挿入） */}
            {work.aiReview && (
              <section className="mt-6">
                <h2 className="text-lg font-bold">体験レポ</h2>
                <div className="mt-2 space-y-4">
                  {(() => {
                    // 段落に分割（空行で区切る）
                    const paragraphs = work.aiReview
                      .split(/\n\n+/)
                      .filter((p) => p.trim());
                    // 画像を挿入する間隔（3段落ごと）
                    const imageInterval = 3;
                    // 後半のエロいシーンを使う（最後から2〜4番目）
                    const totalImages = work.sampleImages.length;
                    const availableImages =
                      totalImages >= 4
                        ? work.sampleImages.slice(-4, -1) // 最後から4〜2番目
                        : work.sampleImages.slice(0, 3);
                    let imageIndex = 0;

                    return paragraphs.map((paragraph, i) => (
                      <div key={`p-${paragraph.slice(0, 20)}-${i}`}>
                        <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
                          {paragraph}
                        </p>
                        {/* 画像挿入: 3段落ごと、かつ画像がまだある場合 */}
                        {(i + 1) % imageInterval === 0 &&
                          imageIndex < availableImages.length && (
                            <div className="my-4 overflow-hidden rounded-lg">
                              <img
                                src={availableImages[imageIndex++]}
                                alt="サンプル"
                                className="w-full object-cover"
                                loading="lazy"
                              />
                            </div>
                          )}
                      </div>
                    ));
                  })()}
                </div>
              </section>
            )}

            {/* CTA */}
            <div className="mt-6 rounded-lg border border-primary/30 bg-primary/5 p-4">
              <p className="mb-3 text-center text-sm font-medium">
                この作品をVRで体験してみませんか？
              </p>
              <a
                href={work.fanzaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-bold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                FANZAで詳細を見る
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            {/* 全サンプル画像（1カラム縦並び） */}
            {work.sampleImages.length > 0 && (
              <section className="mt-8">
                <h2 className="text-lg font-bold">サンプルギャラリー</h2>
                <div className="mt-3 space-y-3">
                  {work.sampleImages.map((url) => (
                    <div
                      key={url}
                      className="overflow-hidden rounded-lg bg-muted"
                    >
                      <img
                        src={url}
                        alt="サンプル画像"
                        className="w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* サイドバー */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">
              {/* 価格・購入 */}
              <div className="rounded-lg border border-border bg-card p-4">
                {/* セール情報バナー */}
                {isOnSale && work.discountPercent > 0 && (
                  <div className="mb-3 flex items-center justify-center gap-2 rounded bg-red-600/10 py-2">
                    <span className="rounded bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
                      {work.discountPercent}%OFF
                    </span>
                    <span className="text-sm font-medium text-red-600">
                      今だけの特別価格！
                    </span>
                  </div>
                )}

                <div className="text-center">
                  {isOnSale ? (
                    <div>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-lg text-muted-foreground line-through">
                          ¥{work.listPrice.toLocaleString()}
                        </span>
                        <span className="rounded bg-red-600 px-1.5 py-0.5 text-xs font-bold text-white">
                          {work.discountPercent}%OFF
                        </span>
                      </div>
                      <div className="text-3xl font-bold text-red-500">
                        ¥{work.price.toLocaleString()}〜
                      </div>
                      {work.campaignEndDate && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {work.campaignEndDate}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-3xl font-bold">
                      {work.price > 0 ? `¥${work.price.toLocaleString()}〜` : "価格を確認"}
                    </div>
                  )}
                </div>

                <a
                  href={work.fanzaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-bold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  FANZAで購入
                  <ExternalLink className="h-4 w-4" />
                </a>

                <p className="mt-3 text-center text-xs text-muted-foreground">
                  ※FANZAの商品ページへ移動します
                </p>
              </div>

              {/* 作品情報 */}
              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="font-bold">作品情報</h3>
                <dl className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">VR形式</dt>
                    <dd>{work.vrType}</dd>
                  </div>
                  {work.duration > 0 && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">再生時間</dt>
                      <dd>{work.duration}分</dd>
                    </div>
                  )}
                  {work.releaseDate && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">配信開始日</dt>
                      <dd>{work.releaseDate}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">対応デバイス</dt>
                    <dd>Quest / PSVR / PC VR</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* スマホ用固定フッターCTA（ナビゲーションの上に配置） */}
      <div className="fixed bottom-14 left-0 right-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur-sm lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            {isOnSale ? (
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground line-through">
                    ¥{work.listPrice.toLocaleString()}
                  </span>
                  <span className="text-lg font-bold text-red-500">
                    ¥{work.price.toLocaleString()}〜
                  </span>
                  <span className="rounded bg-red-600 px-1.5 py-0.5 text-xs font-bold text-white">
                    {work.discountPercent}%OFF
                  </span>
                </div>
                {work.campaignEndDate && (
                  <p className="text-xs text-muted-foreground">
                    {work.campaignEndDate}
                  </p>
                )}
              </div>
            ) : (
              <div className="text-lg font-bold">
                {work.price > 0 ? `¥${work.price.toLocaleString()}〜` : "価格を確認"}
              </div>
            )}
          </div>
          <a
            href={work.fanzaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-bold text-primary-foreground"
          >
            FANZAで見る
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* 固定フッター（CTA + ナビ）分のスペーサー（スマホのみ） */}
      <div className="h-32 lg:hidden" />
    </div>
  );
}
