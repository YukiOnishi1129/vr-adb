import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { getActresses } from "@/lib/data-loader";

export default async function ActressesPage() {
  const actresses = await getActresses();

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
          <span className="text-foreground">出演者一覧</span>
        </nav>

        <h1 className="mb-6 text-2xl font-bold">出演者一覧</h1>

        {actresses.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {actresses.map((actress) => (
              <Link
                key={actress.name}
                href={`/actresses/${actress.name}`}
                className="group overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary/50"
              >
                <div className="relative aspect-video overflow-hidden bg-muted">
                  <Image
                    src={actress.thumbnailUrl}
                    alt={actress.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  />
                </div>
                <div className="p-3 text-center">
                  <h3 className="font-medium">{actress.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {actress.workCount}作品
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">出演者がありません。</p>
        )}
      </main>

      <Footer />
    </div>
  );
}
