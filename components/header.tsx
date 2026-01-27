import { Glasses, Menu, Search } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Glasses className="h-6 w-6 text-[var(--primary)]" />
          <span className="text-lg font-bold">VR-ADB</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            ランキング
          </Link>
          <Link
            href="/sale"
            className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            セール
          </Link>
          <Link
            href="/actresses"
            className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            女優
          </Link>
          <Link
            href="/genres"
            className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            ジャンル
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-lg p-2 hover:bg-[var(--secondary)]"
          >
            <Search className="h-5 w-5 text-[var(--muted-foreground)]" />
          </button>
          <button
            type="button"
            className="rounded-lg p-2 hover:bg-[var(--secondary)] md:hidden"
          >
            <Menu className="h-5 w-5 text-[var(--muted-foreground)]" />
          </button>
        </div>
      </div>
    </header>
  );
}
