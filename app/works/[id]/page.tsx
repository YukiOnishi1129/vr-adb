import {
  Calendar,
  ChevronRight,
  Clock,
  ExternalLink,
  Star,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { WorkCard } from "@/components/work-card";
import { mockWorks } from "@/lib/mock-data";

export function generateStaticParams() {
  return mockWorks.map((work) => ({
    id: work.id.toString(),
  }));
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const work = mockWorks.find((w) => w.id.toString() === id);

  if (!work) {
    notFound();
  }

  const salePrice = work.discountRate
    ? Math.floor(work.price * (1 - work.discountRate / 100))
    : null;

  const relatedWorks = mockWorks.filter((w) => w.id !== work.id).slice(0, 3);

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
          <span className="text-foreground">{work.title.slice(0, 20)}...</span>
        </nav>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* メインコンテンツ */}
          <div className="lg:col-span-2">
            {/* サムネイル */}
            <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
              <img
                src={work.thumbnailUrl}
                alt={work.title}
                className="h-full w-full object-cover"
              />
              {work.discountRate && (
                <div className="absolute left-3 top-3 rounded bg-red-600 px-3 py-1 text-sm font-bold text-white">
                  {work.discountRate}%OFF
                </div>
              )}
              <div className="absolute bottom-3 right-3 rounded bg-black/70 px-3 py-1 text-sm text-white">
                {work.vrType}
              </div>
            </div>

            {/* タイトル */}
            <h1 className="mt-4 text-xl font-bold leading-tight md:text-2xl">
              {work.title}
            </h1>

            {/* 評価・再生時間 */}
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <span className="font-medium text-foreground">
                  {work.rating.toFixed(1)}
                </span>
                <span>({work.reviewCount}件)</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {work.duration}分
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {work.releaseDate}
              </span>
            </div>

            {/* 出演者・メーカー */}
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">出演：</span>
                {work.actresses.map((actress, i) => (
                  <span key={actress}>
                    <Link
                      href={`/actresses/${encodeURIComponent(actress)}`}
                      className="text-primary hover:underline"
                    >
                      {actress}
                    </Link>
                    {i < work.actresses.length - 1 && "、"}
                  </span>
                ))}
              </div>
              <div>
                <span className="text-muted-foreground">メーカー：</span>
                <span>{work.maker}</span>
              </div>
            </div>

            {/* ジャンル */}
            <div className="mt-4 flex flex-wrap gap-2">
              {work.genres.map((genre) => (
                <Link
                  key={genre}
                  href={`/genres/${encodeURIComponent(genre)}`}
                  className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm hover:bg-secondary/80"
                >
                  <Tag className="h-3 w-3" />
                  {genre}
                </Link>
              ))}
            </div>

            {/* 作品紹介 */}
            <section className="mt-6">
              <h2 className="text-lg font-bold">作品紹介</h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                {work.summary}
              </p>
            </section>

            {/* レビュー（モック） */}
            <section className="mt-8">
              <h2 className="text-lg font-bold">ユーザーレビュー</h2>
              <div className="mt-4 space-y-4">
                <div className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i <= 5 ? "fill-yellow-500 text-yellow-500" : "text-muted"}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      購入者A
                    </span>
                  </div>
                  <p className="mt-2 text-sm">
                    没入感が素晴らしい！VRならではの臨場感で大満足でした。画質も綺麗で、Quest3で視聴しましたがとても快適に楽しめました。
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i <= 4 ? "fill-yellow-500 text-yellow-500" : "text-muted"}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      購入者B
                    </span>
                  </div>
                  <p className="mt-2 text-sm">
                    内容は良かったですが、もう少し長さがあると嬉しかった。でもコスパは良いと思います。リピートする予定です。
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* サイドバー */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">
              {/* 価格・購入 */}
              <div className="rounded-lg border border-border bg-card p-4">
                <div className="text-center">
                  {salePrice ? (
                    <div>
                      <span className="text-lg text-muted-foreground line-through">
                        ¥{work.price.toLocaleString()}
                      </span>
                      <div className="text-3xl font-bold text-red-500">
                        ¥{salePrice.toLocaleString()}
                      </div>
                      {work.saleEndDate && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          セール終了: {work.saleEndDate}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-3xl font-bold">
                      ¥{work.price.toLocaleString()}
                    </div>
                  )}
                </div>

                <a
                  href="#"
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-bold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  FANZAで購入
                  <ExternalLink className="h-4 w-4" />
                </a>

                <p className="mt-3 text-center text-xs text-muted-foreground">
                  ※FANZAの商品ページへ移動します
                </p>
              </div>

              {/* 作品情報 */}
              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="font-bold">作品情報</h3>
                <dl className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">VR形式</dt>
                    <dd>{work.vrType}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">再生時間</dt>
                    <dd>{work.duration}分</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">配信開始日</dt>
                    <dd>{work.releaseDate}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">対応デバイス</dt>
                    <dd>Quest / PSVR / PC VR</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* 関連作品 */}
        <section className="mt-12">
          <h2 className="mb-4 text-lg font-bold">関連作品</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedWorks.map((w) => (
              <WorkCard key={w.id} work={w} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
