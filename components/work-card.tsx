import { Clock, Star } from "lucide-react";
import Link from "next/link";
import type { Work } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function WorkCard({ work }: { work: Work }) {
  const salePrice = work.discountRate
    ? Math.floor(work.price * (1 - work.discountRate / 100))
    : null;

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
          {work.discountRate && (
            <Badge
              variant="destructive"
              className="absolute left-2 top-2 rounded-md"
            >
              {work.discountRate}%OFF
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

          <p className="mt-1 text-xs text-muted-foreground">
            {work.actresses.join(", ")}
          </p>

          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
              {work.rating.toFixed(1)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {work.duration}分
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-1">
              {work.genres.slice(0, 2).map((genre) => (
                <Badge key={genre} variant="secondary" className="text-xs">
                  {genre}
                </Badge>
              ))}
            </div>
            <div className="text-right">
              {salePrice ? (
                <div>
                  <span className="text-xs text-muted-foreground line-through">
                    ¥{work.price.toLocaleString()}
                  </span>
                  <span className="ml-1 font-bold text-red-500">
                    ¥{salePrice.toLocaleString()}
                  </span>
                </div>
              ) : (
                <span className="font-bold">
                  ¥{work.price.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
