import { ChevronRight, User } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { mockActresses, mockWorks } from "@/lib/mock-data";

export default function ActressesPage() {
  // 各女優の作品数をカウント
  const actressesWithCount = mockActresses.map((actress) => ({
    ...actress,
    count: mockWorks.filter((w) => w.actresses.includes(actress.name)).length,
  }));

  // 作品数順にソート
  const sortedActresses = [...actressesWithCount].sort(
    (a, b) => b.count - a.count
  );

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
          <span className="text-foreground">出演者一覧</span>
        </nav>

        <h1 className="mb-6 text-2xl font-bold">出演者一覧</h1>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {sortedActresses.map((actress) => (
            <Link
              key={actress.name}
              href={`/actresses/${encodeURIComponent(actress.name)}`}
              className="group overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary/50"
            >
              <div className="relative aspect-square overflow-hidden bg-muted">
                {actress.thumbnail ? (
                  <img
                    src={actress.thumbnail}
                    alt={actress.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <User className="h-16 w-16 text-muted-foreground/50" />
                  </div>
                )}
              </div>
              <div className="p-3 text-center">
                <h3 className="font-medium">{actress.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {actress.count}作品
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
