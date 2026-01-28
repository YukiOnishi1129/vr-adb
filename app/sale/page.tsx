import { ChevronRight, Flame } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { WorkCard } from "@/components/work-card";
import { getWorks } from "@/lib/data-loader";

export default async function SalePage() {
  const works = await getWorks();
  // セール中の作品をフィルタ（price < listPrice）
  const saleWorks = works.filter((w) => w.listPrice > 0 && w.price < w.listPrice);

  // 割引率順にソート
  const sortedWorks = [...saleWorks].sort((a, b) => {
    const discountA = a.listPrice > 0 ? (a.listPrice - a.price) / a.listPrice : 0;
    const discountB = b.listPrice > 0 ? (b.listPrice - b.price) / b.listPrice : 0;
    return discountB - discountA;
  });

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
          <span className="text-foreground">セール中の作品</span>
        </nav>

        {/* ヘッダー */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
            <Flame className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">セール中の作品</h1>
            <p className="text-sm text-muted-foreground">
              {sortedWorks.length}作品がセール中
            </p>
          </div>
        </div>

        {/* 作品一覧 */}
        {sortedWorks.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sortedWorks.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            現在セール中の作品はありません。
          </p>
        )}
      </main>

      <Footer />
    </div>
  );
}
