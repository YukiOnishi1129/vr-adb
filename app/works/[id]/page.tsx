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
import { FanzaLink } from "@/components/fanza-link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { WorkCard } from "@/components/work-card";
import {
  getWorks,
  getWorkById,
  getWorksByActressExcluding,
  getSimilarWorks,
  getPopularWorks,
} from "@/lib/data-loader";

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

  // 関連作品を取得
  const mainActress = work?.actresses?.[0];
  const [actressWorks, similarWorks, popularWorks] = await Promise.all([
    mainActress && work ? getWorksByActressExcluding(mainActress, work.id, 4) : Promise.resolve([]),
    work ? getSimilarWorks(work, 4) : Promise.resolve([]),
    work ? getPopularWorks(work.id, 4) : Promise.resolve([]),
  ]);

  if (!work) {
    notFound();
  }

  // セール中かどうか
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
              {/* 高評価バッジ */}
              {work.rating >= 4.5 && (
                <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded bg-amber-500/90 px-2 py-1 text-xs font-bold text-white">
                  <Star className="h-3 w-3 fill-white" />
                  高評価
                </div>
              )}
            </div>

            {/* タイトル */}
            <h1 className="mt-4 text-xl font-bold leading-tight md:text-2xl">
              {work.title}
            </h1>

            {/* ファーストビューCTA */}
            <div className={`mt-4 rounded-lg border p-4 ${isOnSale ? "border-orange-500/50 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30" : "border-border bg-card"}`}>
              {/* セール情報バナー */}
              {isOnSale && work.discountPercent > 0 && (
                <div className="mb-3 flex items-center justify-center gap-2">
                  <span className="rounded bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
                    {work.discountPercent}%OFF
                  </span>
                  <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                    今だけの特別価格！
                  </span>
                </div>
              )}

              {/* 評価 */}
              {work.rating > 0 && (
                <div className="flex items-center justify-center gap-2">
                  {renderStars(work.rating)}
                  <span className="text-xl font-bold text-red-500">{work.rating.toFixed(1)}</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
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
              <FanzaLink
                url={work.fanzaUrl}
                contentId={work.id}
                source="firstview_cta"
                className={`mt-4 flex w-full items-center justify-center gap-2 rounded-lg py-3 font-bold text-white transition-colors ${isOnSale ? "bg-orange-500 hover:bg-orange-600" : "bg-primary hover:bg-primary/90"}`}
              >
                FANZAで詳細を見る
                <ExternalLink className="h-4 w-4" />
              </FanzaLink>

              <p className="mt-2 text-center text-xs text-muted-foreground">
                無料のサンプル動画で確認できます
              </p>
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

            {/* AIタグ（2d-adb風） */}
            {work.aiTags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {work.aiTags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/genres/${encodeURIComponent(tag)}`}
                    className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-800/50"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}

            {/* シチュエーション・フェチタグ */}
            {(work.situations.length > 0 || work.fetishTags.length > 0) && (
              <div className="mt-3 flex flex-wrap gap-2">
                {work.situations.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-pink-100 px-3 py-1 text-sm text-pink-700 dark:bg-pink-900/50 dark:text-pink-300"
                  >
                    {s}
                  </span>
                ))}
                {work.fetishTags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-700 dark:bg-purple-900/50 dark:text-purple-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            {/* サンプル画像（おすすめの理由の前に配置） */}
            {work.sampleImages.length > 0 && (
              <div className="mt-6 space-y-3">
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
            )}

            {/* おすすめの理由（2d-adb風） */}
            {work.aiRecommendReason && (
              <section className="mt-6 rounded-lg bg-secondary/50 p-4">
                <h2 className="text-sm font-medium text-muted-foreground">おすすめの理由</h2>
                <p className="mt-2 text-foreground">{work.aiRecommendReason}</p>
              </section>
            )}

            {/* 要約（2d-adb風） */}
            {work.aiSummary && (
              <section className="mt-4 rounded-lg bg-secondary/50 p-4">
                <h2 className="text-sm font-medium text-muted-foreground">要約</h2>
                <p className="mt-2 text-foreground">{work.aiSummary}</p>
              </section>
            )}

            {/* こんな人におすすめ（2d-adb風） */}
            {work.aiTargetAudience && (
              <section className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950">
                <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  🎯 こんな人におすすめ
                </h2>
                <p className="mt-2 text-gray-800 dark:text-gray-200">
                  {work.aiTargetAudience}
                </p>
              </section>
            )}

            {/* 刺さりポイント（2d-adb風） */}
            {work.aiAppealPoints && (
              <section className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
                <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  これが刺さる！
                </h2>
                <p className="mt-2 text-gray-800 dark:text-gray-200">
                  {work.aiAppealPoints}
                </p>
              </section>
            )}

            {/* 注意点（2d-adb風） */}
            {work.aiWarnings && (
              <section className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-4 dark:border-rose-800 dark:bg-rose-950">
                <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  ⚠️ 注意点
                </h2>
                <p className="mt-2 text-gray-800 dark:text-gray-200">
                  {work.aiWarnings}
                </p>
              </section>
            )}

            {/* vr-adb編集部レビュー（体験レポを置き換え） */}
            {work.aiReview && (
              <section className="mt-6 rounded-lg border border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 p-4 dark:border-purple-800 dark:from-purple-950 dark:to-indigo-950">
                <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  📝 vr-adb編集部レビュー
                </h2>
                <p className="mt-2 leading-relaxed text-gray-800 dark:text-gray-200">
                  {work.aiReview}
                </p>
              </section>
            )}

            {/* CTA */}
            <div className={`mt-6 rounded-lg border p-4 ${isOnSale ? "border-orange-500/50 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30" : "border-primary/30 bg-primary/5"}`}>
              {isOnSale && work.discountPercent > 0 && (
                <div className="mb-3 flex items-center justify-center gap-2">
                  <span className="rounded bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
                    {work.discountPercent}%OFF
                  </span>
                  <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                    今だけの特別価格！
                  </span>
                </div>
              )}
              <p className="mb-3 text-center text-sm font-medium text-gray-800 dark:text-gray-200">
                この作品をVRで体験してみませんか？
              </p>
              <FanzaLink
                url={work.fanzaUrl}
                contentId={work.id}
                source="mid_cta"
                className={`flex w-full items-center justify-center gap-2 rounded-lg py-3 font-bold text-white transition-colors ${isOnSale ? "bg-orange-500 hover:bg-orange-600" : "bg-primary hover:bg-primary/90"}`}
              >
                FANZAで詳細を見る
                <ExternalLink className="h-4 w-4" />
              </FanzaLink>
            </div>

            {/* ジャンル */}
            {work.genres.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
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
          </div>

          {/* サイドバー */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">
              {/* 価格・購入 */}
              <div className={`rounded-lg border p-4 ${isOnSale ? "border-orange-500/50 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30" : "border-border bg-card"}`}>
                {/* セール情報バナー */}
                {isOnSale && work.discountPercent > 0 && (
                  <div className="mb-3 flex items-center justify-center gap-2">
                    <span className="rounded bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
                      {work.discountPercent}%OFF
                    </span>
                    <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
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

                <FanzaLink
                  url={work.fanzaUrl}
                  contentId={work.id}
                  source="sidebar_cta"
                  className={`mt-4 flex w-full items-center justify-center gap-2 rounded-lg py-3 font-bold text-white transition-colors ${isOnSale ? "bg-orange-500 hover:bg-orange-600" : "bg-primary hover:bg-primary/90"}`}
                >
                  FANZAで購入
                  <ExternalLink className="h-4 w-4" />
                </FanzaLink>

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

        {/* 関連作品セクション */}
        <div className="mt-12 space-y-10">
          {/* 同じ女優の作品 */}
          {actressWorks.length > 0 && mainActress && (
            <section>
              <h2 className="mb-4 text-lg font-bold">
                🎬 {mainActress}の他の作品
              </h2>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                {actressWorks.map((w) => (
                  <WorkCard key={w.id} work={w} />
                ))}
              </div>
            </section>
          )}

          {/* 似た作品 */}
          {similarWorks.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-bold">
                🔥 この作品が好きな人はこれも
              </h2>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                {similarWorks.map((w) => (
                  <WorkCard key={w.id} work={w} />
                ))}
              </div>
            </section>
          )}

          {/* 人気作品 */}
          {popularWorks.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-bold">
                👑 今人気の作品
              </h2>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                {popularWorks.map((w) => (
                  <WorkCard key={w.id} work={w} />
                ))}
              </div>
            </section>
          )}
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
          <FanzaLink
            url={work.fanzaUrl}
            contentId={work.id}
            source="fixed_cta"
            className={`flex items-center gap-2 rounded-lg px-6 py-3 font-bold text-white ${isOnSale ? "bg-orange-500" : "bg-primary"}`}
          >
            FANZAで見る
            <ExternalLink className="h-4 w-4" />
          </FanzaLink>
        </div>
      </div>

      {/* 固定フッター（CTA + ナビ）分のスペーサー（スマホのみ） */}
      <div className="h-32 lg:hidden" />
    </div>
  );
}
