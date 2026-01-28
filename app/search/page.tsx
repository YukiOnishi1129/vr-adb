"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { WorkCard } from "@/components/work-card";
import type { Work } from "@/lib/data-loader";
import type { SearchItem } from "@/lib/search";

// SearchItem → Work 変換（WorkCardで使えるように）
function searchItemToWork(item: SearchItem): Work {
  // ratingを数値に変換（nullや文字列の場合に対応）
  let rating = 0;
  if (typeof item.rt === "number") {
    rating = item.rt;
  } else if (typeof item.rt === "string") {
    rating = parseFloat(item.rt) || 0;
  }

  return {
    id: item.id,
    title: item.t,
    thumbnailUrl: item.img,
    sampleImages: [],
    actresses: item.ac || [],
    maker: item.mk || "",
    releaseDate: item.rel || "",
    duration: typeof item.dur === "number" ? item.dur : 0,
    rating,
    reviewCount: typeof item.rc === "number" ? item.rc : 0,
    price: typeof item.p === "number" ? item.p : 0,
    listPrice: typeof item.lp === "number" ? item.lp : 0,
    discountPercent: typeof item.dr === "number" ? item.dr : 0,
    campaignTitle: null,
    campaignEndDate: null,
    vrType: "VR",
    genres: item.g || [],
    summary: "",
    aiReview: null,
    fanzaUrl: "",
  };
}

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [searchIndex, setSearchIndex] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(true);

  // URLのクエリが変わったら入力欄も更新
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    fetch("/data/search-index.json")
      .then((res) => res.json())
      .then((data) => {
        setSearchIndex(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredWorks = useMemo(() => {
    if (!initialQuery || searchIndex.length === 0) {
      return [];
    }

    const terms = initialQuery
      .toLowerCase()
      .split(/\s+/)
      .filter((t) => t.length > 0);

    return searchIndex
      .filter((item) => {
        const searchableText = [item.t, ...item.ac, ...item.g, item.mk]
          .join(" ")
          .toLowerCase();

        return terms.every((term) => searchableText.includes(term));
      })
      .map(searchItemToWork);
  }, [initialQuery, searchIndex]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <>
      {/* 検索フォーム */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="女優名、ジャンル、タイトルで検索..."
            className="w-full rounded-full border border-border bg-secondary py-3 pl-12 pr-4 text-base outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary"
          />
        </div>
      </form>

      {/* 検索結果 */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : !initialQuery ? (
        <div className="py-12 text-center">
          <Search className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">
            検索ワードを入力してください
          </p>
        </div>
      ) : filteredWorks.length === 0 ? (
        <div className="py-12 text-center">
          <Search className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 text-muted-foreground">
            「{initialQuery}」に一致する作品が見つかりませんでした
          </p>
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-muted-foreground">
            「{initialQuery}」の検索結果: {filteredWorks.length}件
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredWorks.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        </>
      )}
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-6 pb-24 lg:pb-6">
        <h1 className="mb-6 text-2xl font-bold">検索</h1>

        <Suspense
          fallback={
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          }
        >
          <SearchContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
