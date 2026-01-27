import { Glasses } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--card)]">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <Glasses className="h-5 w-5 text-[var(--primary)]" />
            <span className="font-bold">VR-ADB</span>
          </div>

          <nav className="flex flex-wrap justify-center gap-4 text-sm text-[var(--muted-foreground)]">
            <Link href="/privacy" className="hover:text-[var(--foreground)]">
              プライバシーポリシー
            </Link>
          </nav>
        </div>

        <div className="mt-6 text-center text-xs text-[var(--muted-foreground)]">
          <p>当サイトはアフィリエイトプログラムに参加しています。</p>
          <p className="mt-1">
            &copy; {new Date().getFullYear()} VR-ADB. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
