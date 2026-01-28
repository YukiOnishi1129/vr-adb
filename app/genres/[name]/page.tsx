import { ChevronRight, Tag } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { WorkCard } from "@/components/work-card";
import { getWorks } from "@/lib/data-loader";

interface Props {
  params: Promise<{ name: string }>;
}

export async function generateStaticParams() {
  const works = await getWorks();

  // 全ジャンルを収集
  const genres = new Set<string>();
  for (const work of works) {
    for (const genre of work.genres) {
      genres.add(genre);
    }
  }

  return Array.from(genres).map((name) => ({
    name: encodeURIComponent(name),
  }));
}

export default async function GenreDetailPage({ params }: Props) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);
  const allWorks = await getWorks();

  const works = allWorks.filter((w) => w.genres.includes(decodedName));

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
          <Link href="/genres" className="hover:text-foreground">
            ジャンル
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{decodedName}</span>
        </nav>

        {/* ヘッダー */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
            <Tag className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{decodedName}</h1>
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
      </main>

      <Footer />
    </div>
  );
}
