import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HorizontalScrollSection } from "@/components/horizontal-scroll-section";
import { SaleBanner } from "@/components/sale-banner";
import { Badge } from "@/components/ui/badge";
import {
  getWorksByRanking,
  getSaleWorks,
  getHighRatedWorks,
  getBargainWorks,
  getNewWorks,
  getActresses,
  getGenres,
  getGenreRankingWorks,
} from "@/lib/data-loader";

export default async function HomePage() {
  // データ取得
  const [
    rankingWorks,
    saleWorks,
    highRatedWorks,
    bargainWorks,
    newWorks,
    actresses,
    genres,
  ] = await Promise.all([
    getWorksByRanking(),
    getSaleWorks(),
    getHighRatedWorks(4.0, 12),
    getBargainWorks(1000, 12),
    getNewWorks(12),
    getActresses(),
    getGenres(),
  ]);

  // 人気ジャンルのランキング（中出し、痴女など）
  const popularGenres = genres.slice(0, 5);
  const genreRankings = await Promise.all(
    popularGenres.map(async (genre) => ({
      genre: genre.name,
      works: await getGenreRankingWorks(genre.name, 12),
    }))
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-6 pb-24 lg:pb-6">
        {/* セールバナー */}
        {saleWorks.length > 0 && <SaleBanner saleWorks={saleWorks} />}

        {/* VRランキング（横スクロール＋金銀銅バッジ） */}
        {rankingWorks.length > 0 && (
          <HorizontalScrollSection
            title="迷ったらこれ！"
            subtitle="VR売上ランキング"
            href="/ranking"
            works={rankingWorks.slice(0, 12)}
            showRankBadge
            rankBadgeColor="gold"
          />
        )}

        {/* 高評価4.0以上（横スクロール） */}
        {highRatedWorks.length > 0 && (
          <HorizontalScrollSection
            title="ハズレなしの高評価"
            subtitle="評価4.0以上の厳選作品"
            href="/search?sort=rating"
            works={highRatedWorks}
          />
        )}

        {/* セール中（横スクロール） */}
        {saleWorks.length > 0 && (
          <HorizontalScrollSection
            title="今がチャンス"
            subtitle="セール中の作品"
            href="/sale"
            works={saleWorks.slice(0, 12)}
          />
        )}

        {/* 爆安コーナー（横スクロール） */}
        {bargainWorks.length > 0 && (
          <HorizontalScrollSection
            title="1000円以下で買える"
            subtitle="お買い得VR作品"
            href="/sale?max=1000"
            works={bargainWorks}
          />
        )}

        {/* 新着作品（横スクロール） */}
        {newWorks.length > 0 && (
          <HorizontalScrollSection
            title="新着作品"
            subtitle="最新リリース"
            href="/search?sort=new"
            works={newWorks}
          />
        )}

        {/* ジャンル別ランキング */}
        {genreRankings.map(
          ({ genre, works }) =>
            works.length > 0 && (
              <HorizontalScrollSection
                key={genre}
                title={`${genre}ランキング`}
                subtitle={`${genre}ジャンルの人気作品`}
                href={`/genres/${encodeURIComponent(genre)}`}
                works={works}
                showRankBadge
                rankBadgeColor="emerald"
              />
            )
        )}

        {/* 人気女優 */}
        {actresses.length > 0 && (
          <section className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">人気女優</h2>
              <Link
                href="/actresses"
                className="flex items-center gap-1 text-sm text-primary transition-colors hover:text-primary/80"
              >
                もっと見る
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {actresses.slice(0, 12).map((actress) => (
                <Link
                  key={actress.name}
                  href={`/actresses/${encodeURIComponent(actress.name)}`}
                >
                  <Badge
                    variant="secondary"
                    className="cursor-pointer hover:opacity-80 text-sm py-1.5 px-3"
                  >
                    {actress.name}
                    <span className="ml-1 opacity-70">({actress.workCount})</span>
                  </Badge>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 人気ジャンル */}
        {genres.length > 0 && (
          <section className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">人気ジャンル</h2>
              <Link
                href="/genres"
                className="flex items-center gap-1 text-sm text-primary transition-colors hover:text-primary/80"
              >
                もっと見る
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {genres.slice(0, 20).map((genre) => (
                <Link
                  key={genre.name}
                  href={`/genres/${encodeURIComponent(genre.name)}`}
                >
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-secondary text-sm py-1.5 px-3"
                  >
                    {genre.name}
                    <span className="ml-1 opacity-70">({genre.workCount})</span>
                  </Badge>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* サイト説明 */}
        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-bold">VR-ADBについて</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            VR-ADBは、FANZA
            VRで配信されているアダルトVR動画を専門に紹介するレビューサイトです。
            人気作品のランキング、セール情報、女優別・ジャンル別の作品まとめなど、
            VR AV選びに役立つ情報を毎日更新しています。
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Meta Quest、PlayStation VR、PC
            VRなど各種デバイスに対応した作品を幅広くカバー。
            8K高画質VRから定番の人気作まで、あなたにぴったりの一本が見つかります。
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
