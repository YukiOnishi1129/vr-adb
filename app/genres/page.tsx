import { ChevronRight, Tag } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { mockGenres, mockWorks } from "@/lib/mock-data";

export default function GenresPage() {
  // 各ジャンルの作品数をカウント
  const genresWithCount = mockGenres.map((genre) => ({
    ...genre,
    count: mockWorks.filter((w) => w.genres.includes(genre.name)).length,
  }));

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
      </main>

      <Footer />
    </div>
  );
}
