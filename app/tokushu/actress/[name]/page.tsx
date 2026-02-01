import { User, ChevronRight, Star, ExternalLink, Trophy } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { WorkCard } from "@/components/work-card";
import {
  getActressFeatures,
  getActressFeatureByName,
  getWorksByActress,
  getWorkById,
  type Work,
} from "@/lib/data-loader";

interface Props {
  params: Promise<{ name: string }>;
}

export async function generateStaticParams() {
  const features = await getActressFeatures();
  return features.map((f) => ({
    name: f.name,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { name: rawName } = await params;
  const name = decodeURIComponent(rawName);
  const feature = await getActressFeatureByName(name);

  if (!feature) {
    return { title: "女優特集 | VR-ADB" };
  }

  return {
    title: `${feature.name}のVR特集 | VR-ADB`,
    description: feature.description,
  };
}

export default async function ActressFeatureDetailPage({ params }: Props) {
  const { name: rawName } = await params;
  const name = decodeURIComponent(rawName);

  const feature = await getActressFeatureByName(name);
  if (!feature) {
    notFound();
  }

  // おすすめ作品の詳細を取得
  const recommendedWorkIds = feature.recommendedWorks.map((w) =>
    String(w.work_id)
  );
  const allWorks = await getWorksByActress(name);

  // おすすめ作品をwork_idでマッチング
  const recommendedWorksWithDetails: Array<{
    work: Work;
    reason: string;
    targetAudience: string;
  }> = [];

  for (const rec of feature.recommendedWorks) {
    // fanza_product_idまたはwork_idで検索
    const work = allWorks.find(
      (w) => w.id === String(rec.work_id) || Number(w.id) === rec.work_id
    );
    if (work) {
      recommendedWorksWithDetails.push({
        work,
        reason: rec.reason,
        targetAudience: rec.target_audience,
      });
    }
  }

  // セール中作品
  const saleWorks = allWorks.filter((w) => w.discountPercent > 0).slice(0, 6);

  // 新着作品（おすすめ以外）
  const recommendedIds = new Set(recommendedWorkIds);
  const newWorks = allWorks
    .filter((w) => !recommendedIds.has(w.id))
    .sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))
    .slice(0, 6);

  // 他の女優特集
  const allFeatures = await getActressFeatures();
  const otherFeatures = allFeatures
    .filter((f) => f.name !== name)
    .slice(0, 6);

  // 更新日時フォーマット
  const updatedAt = feature.updatedAt
    ? new Date(feature.updatedAt).toLocaleDateString("ja-JP")
    : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-6 pb-24 lg:pb-6">
        {/* パンくず */}
        <nav className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            トップ
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/tokushu/actress" className="hover:text-foreground">
            女優特集
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{name}</span>
        </nav>

        {/* ヘッダーセクション */}
        <div className="mb-8">
          {/* プロフィール */}
          <div className="mb-4 flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-pink-500/10">
              <User className="h-8 w-8 text-pink-500" />
            </div>
            <div className="flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold">{name}</h1>
                {feature.fanzaRanking && (
                  <Badge className="bg-pink-500 text-white">
                    <Trophy className="mr-1 h-3 w-3" />
                    ランキング{feature.fanzaRanking}位
                  </Badge>
                )}
              </div>
              {/* 統計バッジ */}
              <div className="flex flex-wrap gap-2 text-sm">
                <Badge variant="outline">全{feature.totalWorkCount}作品</Badge>
                <Badge variant="outline">単独{feature.soloWorkCount}作品</Badge>
                {feature.avgRating && (
                  <Badge variant="outline">
                    <Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
                    平均{feature.avgRating.toFixed(1)}
                  </Badge>
                )}
                {feature.saleCount > 0 && (
                  <Badge variant="destructive">
                    {feature.saleCount}作品セール中
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* ヘッドラインボックス */}
          <div className="rounded-lg bg-gradient-to-r from-pink-500/10 to-purple-500/10 p-4">
            <div className="mb-1 text-xs text-muted-foreground">
              今週のおすすめ
            </div>
            <h2 className="mb-2 text-lg font-bold">{feature.headline}</h2>
            <p className="text-sm text-muted-foreground">
              {feature.description}
            </p>
            {updatedAt && (
              <div className="mt-2 text-xs text-muted-foreground">
                最終更新: {updatedAt}
              </div>
            )}
          </div>
        </div>

        {/* 厳選おすすめセクション */}
        {recommendedWorksWithDetails.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
              <span className="text-pink-500">厳選</span>おすすめ
            </h2>
            <div className="space-y-4">
              {recommendedWorksWithDetails.map(
                ({ work, reason, targetAudience }, index) => (
                  <div
                    key={work.id}
                    className="overflow-hidden rounded-lg border border-border bg-card"
                  >
                    <div className="flex flex-col sm:flex-row">
                      {/* サムネイル */}
                      <div className="relative aspect-video w-full shrink-0 sm:aspect-[4/3] sm:w-48">
                        <Link href={`/works/${work.id}`}>
                          <Image
                            src={work.thumbnailUrl}
                            alt={work.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, 192px"
                          />
                        </Link>
                        {/* ランクバッジ */}
                        <div className="absolute left-2 top-2">
                          <Badge
                            className={
                              index === 0
                                ? "bg-amber-500 text-white"
                                : index === 1
                                  ? "bg-gray-400 text-white"
                                  : index === 2
                                    ? "bg-amber-700 text-white"
                                    : "bg-pink-500 text-white"
                            }
                          >
                            {index + 1}位
                          </Badge>
                        </div>
                        {/* セールバッジ */}
                        {work.discountPercent > 0 && (
                          <div className="absolute right-2 top-2">
                            <Badge variant="destructive">
                              {work.discountPercent}%OFF
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* 情報 */}
                      <div className="flex flex-1 flex-col p-4">
                        <Link
                          href={`/works/${work.id}`}
                          className="mb-2 font-bold hover:text-pink-500"
                        >
                          {work.title}
                        </Link>

                        {/* 評価・価格 */}
                        <div className="mb-3 flex flex-wrap items-center gap-3 text-sm">
                          {work.rating > 0 && (
                            <span className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              {work.rating.toFixed(1)}
                            </span>
                          )}
                          <span
                            className={
                              work.discountPercent > 0
                                ? "font-bold text-red-500"
                                : ""
                            }
                          >
                            ¥{work.price.toLocaleString()}
                          </span>
                          {work.discountPercent > 0 && (
                            <span className="text-muted-foreground line-through">
                              ¥{work.listPrice.toLocaleString()}
                            </span>
                          )}
                        </div>

                        {/* おすすめポイント */}
                        <div className="mb-2 rounded bg-pink-500/10 p-2">
                          <div className="mb-1 text-xs font-bold text-pink-500">
                            おすすめポイント
                          </div>
                          <p className="text-sm">{reason}</p>
                        </div>

                        {/* ターゲット */}
                        <div className="rounded bg-muted p-2">
                          <div className="mb-1 text-xs font-bold text-muted-foreground">
                            こんな人におすすめ
                          </div>
                          <p className="text-sm">{targetAudience}</p>
                        </div>

                        {/* アクションボタン */}
                        <div className="mt-3 flex gap-2">
                          <Link
                            href={`/works/${work.id}`}
                            className="inline-flex items-center gap-1 rounded bg-pink-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-pink-600"
                          >
                            詳細を見る
                          </Link>
                          {work.fanzaUrl && (
                            <a
                              href={work.fanzaUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded border border-border px-3 py-1.5 text-sm hover:bg-muted whitespace-nowrap"
                            >
                              FANZAで見る
                              <ExternalLink className="h-3 w-3 shrink-0" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </section>
        )}

        {/* セール中作品セクション */}
        {saleWorks.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 text-xl font-bold">
              <span className="text-red-500">{name}</span>のセール中作品
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {saleWorks.map((work) => (
                <WorkCard key={work.id} work={work} />
              ))}
            </div>
          </section>
        )}

        {/* 新着作品セクション */}
        {newWorks.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 text-xl font-bold">最新作</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {newWorks.map((work) => (
                <WorkCard key={work.id} work={work} />
              ))}
            </div>
          </section>
        )}

        {/* 全作品への誘導 */}
        <section className="mb-10">
          <Link
            href={`/actresses/${encodeURIComponent(name)}`}
            className="flex items-center justify-between rounded-lg border-2 border-pink-500/30 bg-card p-4 transition-colors hover:border-pink-500"
          >
            <div className="flex items-center gap-3">
              <User className="h-6 w-6 text-pink-500" />
              <span className="font-bold">
                {name}の全{feature.totalWorkCount}作品を見る
              </span>
            </div>
            <ChevronRight className="h-5 w-5 text-pink-500" />
          </Link>
        </section>

        {/* 他の女優特集 */}
        {otherFeatures.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 text-xl font-bold">他の人気女優特集</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {otherFeatures.map((f) => (
                <Link
                  key={f.id}
                  href={`/tokushu/actress/${encodeURIComponent(f.name)}`}
                  className="group flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:border-pink-500/50"
                >
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-muted">
                    {f.representativeThumbnailUrl ? (
                      <Image
                        src={f.representativeThumbnailUrl}
                        alt={f.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <User className="h-6 w-6 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="font-bold group-hover:text-pink-500">
                        {f.name}
                      </span>
                      {f.fanzaRanking && (
                        <Badge
                          variant="outline"
                          className="shrink-0 text-xs"
                        >
                          #{f.fanzaRanking}
                        </Badge>
                      )}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {f.totalWorkCount}作品
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
