import { ChevronRight, User } from "lucide-react";
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

  // 全女優を収集
  const actresses = new Set<string>();
  for (const work of works) {
    for (const actress of work.actresses) {
      actresses.add(actress);
    }
  }

  return Array.from(actresses).map((name) => ({
    name: encodeURIComponent(name),
  }));
}

export default async function ActressDetailPage({ params }: Props) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);
  const allWorks = await getWorks();

  const works = allWorks.filter((w) => w.actresses.includes(decodedName));

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
          <Link href="/actresses" className="hover:text-foreground">
            出演者
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{decodedName}</span>
        </nav>

        {/* ヘッダー */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-muted">
            <User className="h-10 w-10 text-muted-foreground/50" />
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
            この出演者の作品はまだ登録されていません。
          </p>
        )}
      </main>

      <Footer />
    </div>
  );
}
