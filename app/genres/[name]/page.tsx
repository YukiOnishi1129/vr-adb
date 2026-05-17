import type { Metadata } from "next";
import { ChevronRight, Tag } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { WorkCard } from "@/components/work-card";
import { LastUpdated } from "@/components/last-updated";
import { EditorialCredit } from "@/components/editorial-credit";
import { getGenres, getWorksByGenre } from "@/lib/data-loader";

interface Props {
  params: Promise<{ name: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name: rawName } = await params;
  const name = decodeURIComponent(rawName);
  const works = await getWorksByGenre(name);

  if (works.length === 0) {
    return {
      title: "ジャンルが見つかりません | VR-ADB",
    };
  }

  const year = new Date().getFullYear();
  const saleCount = works.filter((w) => w.listPrice > 0 && w.price < w.listPrice).length;
  const saleBadge = saleCount > 0 ? `【${saleCount}本セール中】` : "";
  const title = `${saleBadge}【${year}年最新】「${name}」のアダルトVR動画おすすめ${works.length}選｜ジャンル別レビュー | VR-ADB`;
  const description = `「${name}」ジャンルのアダルトVR動画${works.length}作品をVR-ADB編集部がレビュー。人気作・新作・セール作品をまとめてチェック。${saleCount > 0 ? `現在${saleCount}本がセール中。` : ""}FANZAで購入可能。`;

  return {
    title,
    description,
    alternates: { canonical: `/genres/${rawName}/` },
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export async function generateStaticParams() {
  const genres = await getGenres();
  return genres.map((g) => ({
    name: g.name,
  }));
}

export default async function GenreDetailPage({ params }: Props) {
  const { name: rawName } = await params;
  const name = decodeURIComponent(rawName);
  const works = await getWorksByGenre(name);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-6 pb-24 lg:pb-6">
        {/* パンくず + 最終更新日 */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <nav className="flex items-center gap-1 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              トップ
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/genres" className="hover:text-foreground">
              ジャンル
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{name}</span>
          </nav>
          <LastUpdated variant="card" />
        </div>

        {/* ヘッダー */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
            <Tag className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{name}</h1>
            <p className="text-sm text-muted-foreground">{works.length}作品</p>
          </div>
        </div>

        {/* 作品一覧 */}
        {works.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {works.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            このジャンルの作品はまだ登録されていません。
          </p>
        )}

        <EditorialCredit />
      </main>

      <Footer />
    </div>
  );
}
