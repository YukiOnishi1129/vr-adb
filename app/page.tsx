import {
  ChevronRight,
  Flame,
  Sparkles,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { WorkCard } from "@/components/work-card";
import { getWorks } from "@/lib/data-loader";

export default async function HomePage() {
  const works = await getWorks();
  const saleWorks = works.filter((w) => w.listPrice > 0 && w.price < w.listPrice);
  const rankingWorks = works.slice(0, 6);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-6 pb-24 lg:pb-6">
        {/* ヒーローセクション */}
        <section className="mb-8 rounded-xl bg-gradient-to-r from-[var(--primary)]/20 to-[var(--primary)]/5 p-6">
          <h1 className="text-2xl font-bold md:text-3xl">
            アダルトVR動画
            <br className="md:hidden" />
            おすすめ作品ガイド
          </h1>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            FANZA
            VRの人気作品を厳選レビュー。ランキング、セール情報を毎日更新中。
          </p>
        </section>

        {/* セール中の作品 */}
        {saleWorks.length > 0 && (
          <section className="mb-10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <Flame className="h-5 w-5 text-red-500" />
                セール中の作品
              </h2>
              <Link
                href="/sale"
                className="flex items-center text-sm text-[var(--primary)] hover:underline"
              >
                すべて見る
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {saleWorks.map((work) => (
                <WorkCard key={work.id} work={work} />
              ))}
            </div>
          </section>
        )}

        {/* 人気ランキング / 作品一覧 */}
        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <Trophy className="h-5 w-5 text-yellow-500" />
              {works.length > 1 ? "人気ランキング" : "最新作品"}
            </h2>
            {works.length > 6 && (
              <Link
                href="/ranking"
                className="flex items-center text-sm text-[var(--primary)] hover:underline"
              >
                すべて見る
                <ChevronRight className="h-4 w-4" />
              </Link>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rankingWorks.map((work, index) => (
              <div key={work.id} className="relative">
                {works.length > 1 && (
                  <div className="absolute -left-2 -top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-bold text-white">
                    {index + 1}
                  </div>
                )}
                <WorkCard work={work} />
              </div>
            ))}
          </div>
        </section>

        {/* サイト説明 */}
        <section className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <Sparkles className="h-5 w-5 text-[var(--primary)]" />
            VR-ADBについて
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted-foreground)]">
            VR-ADBは、FANZA
            VRで配信されているアダルトVR動画を専門に紹介するレビューサイトです。
            人気作品のランキング、セール情報、女優別・ジャンル別の作品まとめなど、
            VR AV選びに役立つ情報を毎日更新しています。
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
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
