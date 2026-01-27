import {
  ChevronRight,
  Flame,
  Sparkles,
  Tag,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { WorkCard } from "@/components/work-card";
import { mockActresses, mockGenres, mockWorks } from "@/lib/mock-data";

export default function HomePage() {
  const saleWorks = mockWorks.filter((w) => w.discountRate);
  const rankingWorks = mockWorks.slice(0, 6);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-6">
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

        {/* 人気ランキング */}
        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <Trophy className="h-5 w-5 text-yellow-500" />
              人気ランキング
            </h2>
            <Link
              href="/ranking"
              className="flex items-center text-sm text-[var(--primary)] hover:underline"
            >
              すべて見る
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rankingWorks.map((work, index) => (
              <div key={work.id} className="relative">
                <div className="absolute -left-2 -top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-bold text-white">
                  {index + 1}
                </div>
                <WorkCard work={work} />
              </div>
            ))}
          </div>
        </section>

        {/* 人気女優 */}
        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <Users className="h-5 w-5 text-pink-500" />
              人気女優
            </h2>
            <Link
              href="/actresses"
              className="flex items-center text-sm text-[var(--primary)] hover:underline"
            >
              すべて見る
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {mockActresses.map((actress) => (
              <Link
                key={actress.name}
                href={`/actresses/${encodeURIComponent(actress.name)}`}
                className="group flex flex-col items-center rounded-lg border border-[var(--border)] bg-[var(--card)] p-3 transition-all hover:border-[var(--primary)]/50"
              >
                <div className="h-16 w-16 overflow-hidden rounded-full bg-[var(--muted)]">
                  <img
                    src={actress.thumbnail}
                    alt={actress.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="mt-2 text-sm font-medium">{actress.name}</span>
                <span className="text-xs text-[var(--muted-foreground)]">
                  {actress.workCount}作品
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ジャンル */}
        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <Tag className="h-5 w-5 text-blue-500" />
              人気ジャンル
            </h2>
            <Link
              href="/genres"
              className="flex items-center text-sm text-[var(--primary)] hover:underline"
            >
              すべて見る
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {mockGenres.map((genre) => (
              <Link
                key={genre.name}
                href={`/genres/${encodeURIComponent(genre.name)}`}
                className="rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm transition-all hover:border-[var(--primary)]/50"
              >
                {genre.name}
                <span className="ml-1 text-xs text-[var(--muted-foreground)]">
                  ({genre.count})
                </span>
              </Link>
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
