import { ChevronRight, Crown, Medal, Star } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { getWorks } from "@/lib/data-loader";

export default async function RankingPage() {
  const works = await getWorks();
  // 評価順にソート
  const rankedWorks = [...works].sort((a, b) => b.rating - a.rating);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return (
          <span className="flex h-6 w-6 items-center justify-center text-sm font-bold text-muted-foreground">
            {rank}
          </span>
        );
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-500/10 border-yellow-500/30";
      case 2:
        return "bg-gray-400/10 border-gray-400/30";
      case 3:
        return "bg-amber-600/10 border-amber-600/30";
      default:
        return "bg-card border-border";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-6">
        {/* パンくず */}
        <nav className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            トップ
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">ランキング</span>
        </nav>

        {/* ヘッダー */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/20">
            <Crown className="h-6 w-6 text-yellow-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">人気ランキング</h1>
            <p className="text-sm text-muted-foreground">
              評価の高い作品をランキング形式で紹介
            </p>
          </div>
        </div>

        {/* ランキング一覧 */}
        {rankedWorks.length > 0 ? (
          <div className="space-y-3">
            {rankedWorks.map((work, index) => {
              const rank = index + 1;
              const isOnSale = work.listPrice > 0 && work.price < work.listPrice;

              return (
                <Link
                  key={work.id}
                  href={`/works/${work.id}`}
                  className={`flex gap-4 rounded-lg border p-4 transition-colors hover:border-primary/50 ${getRankBg(rank)}`}
                >
                  {/* 順位 */}
                  <div className="flex w-8 shrink-0 items-center justify-center">
                    {getRankIcon(rank)}
                  </div>

                  {/* サムネイル */}
                  <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded bg-muted">
                    <img
                      src={work.thumbnailUrl}
                      alt={work.title}
                      className="h-full w-full object-cover"
                    />
                    {isOnSale && work.discountPercent > 0 && (
                      <div className="absolute left-1 top-1 rounded bg-red-600 px-1.5 py-0.5 text-xs font-bold text-white">
                        {work.discountPercent}%OFF
                      </div>
                    )}
                  </div>

                  {/* 情報 */}
                  <div className="flex flex-1 flex-col justify-center">
                    <h3 className="line-clamp-2 font-medium leading-tight">
                      {work.title}
                    </h3>
                    {work.actresses.length > 0 && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {work.actresses.join(", ")}
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-4">
                      {work.rating > 0 && (
                        <span className="flex items-center gap-1 text-sm">
                          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                          {work.rating.toFixed(1)}
                        </span>
                      )}
                      {work.duration > 0 && (
                        <span className="text-sm text-muted-foreground">
                          {work.duration}分
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 価格 */}
                  <div className="flex shrink-0 flex-col items-end justify-center">
                    {isOnSale ? (
                      <>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground line-through">
                            ¥{work.listPrice.toLocaleString()}
                          </span>
                          <span className="rounded bg-red-600 px-1 py-0.5 text-xs font-bold text-white">
                            {work.discountPercent}%OFF
                          </span>
                        </div>
                        <span className="text-lg font-bold text-red-500">
                          ¥{work.price.toLocaleString()}〜
                        </span>
                        {work.campaignEndDate && (
                          <span className="text-xs text-muted-foreground">
                            {work.campaignEndDate}
                          </span>
                        )}
                      </>
                    ) : work.price > 0 ? (
                      <span className="text-lg font-bold">
                        ¥{work.price.toLocaleString()}〜
                      </span>
                    ) : null}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-muted-foreground">作品がありません。</p>
        )}
      </main>

      <Footer />
    </div>
  );
}
