import { Clock, Star } from "lucide-react";
import Link from "next/link";
import type { Work } from "@/lib/data-loader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function WorkCard({ work }: { work: Work }) {
  const isOnSale = work.listPrice > 0 && work.price < work.listPrice;

  return (
    <Link href={`/works/${work.id}`}>
      <Card className="group overflow-hidden p-0 transition-all hover:border-primary/50">
        {/* サムネイル */}
        <div className="relative aspect-video overflow-hidden bg-muted">
          <img
            src={work.thumbnailUrl}
            alt={work.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
          {isOnSale && work.discountPercent > 0 && (
            <Badge
              variant="destructive"
              className="absolute left-2 top-2 rounded-md"
            >
              {work.discountPercent}%OFF
            </Badge>
          )}
          <Badge
            variant="secondary"
            className="absolute bottom-2 right-2 rounded-md bg-black/70 text-white"
          >
            {work.vrType}
          </Badge>
        </div>

        {/* 情報 */}
        <CardContent className="p-3">
          <h3 className="line-clamp-2 text-sm font-medium leading-tight">
            {work.title}
          </h3>

          {work.actresses.length > 0 && (
            <p className="mt-1 text-xs text-muted-foreground">
              {work.actresses.join(", ")}
            </p>
          )}

          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            {work.rating > 0 && (
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                {work.rating.toFixed(1)}
              </span>
            )}
            {work.duration > 0 && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {work.duration}分
              </span>
            )}
          </div>

          <div className="mt-2 flex items-center justify-between">
            {work.genres.length > 0 && (
              <div className="flex items-center gap-1">
                {work.genres.slice(0, 2).map((genre) => (
                  <Badge key={genre} variant="secondary" className="text-xs">
                    {genre}
                  </Badge>
                ))}
              </div>
            )}
            <div className="text-right">
              {isOnSale ? (
                <div>
                  <div className="flex items-center justify-end gap-1">
                    <span className="text-xs text-muted-foreground line-through">
                      ¥{work.listPrice.toLocaleString()}
                    </span>
                    <span className="rounded bg-red-600 px-1 py-0.5 text-xs font-bold text-white">
                      {work.discountPercent}%OFF
                    </span>
                  </div>
                  <span className="font-bold text-red-500">
                    ¥{work.price.toLocaleString()}〜
                  </span>
                  {work.campaignEndDate && (
                    <p className="text-xs text-muted-foreground">
                      {work.campaignEndDate}
                    </p>
                  )}
                </div>
              ) : work.price > 0 ? (
                <span className="font-bold">
                  ¥{work.price.toLocaleString()}〜
                </span>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
