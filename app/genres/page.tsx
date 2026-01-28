import { ChevronRight, Tag } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { getWorks } from "@/lib/data-loader";

export default async function GenresPage() {
  const works = await getWorks();

  // 作品からジャンルを集計
  const genreMap = new Map<string, number>();
  for (const work of works) {
    for (const genre of work.genres) {
      genreMap.set(genre, (genreMap.get(genre) || 0) + 1);
    }
  }

  // カウント順にソート
  const genresWithCount = Array.from(genreMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

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
          <span className="text-foreground">ジャンル一覧</span>
        </nav>

        <h1 className="mb-6 text-2xl font-bold">ジャンル一覧</h1>

        {genresWithCount.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {genresWithCount.map((genre) => (
              <Link
                key={genre.name}
                href={`/genres/${encodeURIComponent(genre.name)}`}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/50"
              >
                <Tag className="h-5 w-5 text-primary" />
                <div>
                  <span className="font-medium">{genre.name}</span>
                  <span className="ml-2 text-sm text-muted-foreground">
                    ({genre.count}作品)
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">ジャンルがありません。</p>
        )}
      </main>

      <Footer />
    </div>
  );
}
