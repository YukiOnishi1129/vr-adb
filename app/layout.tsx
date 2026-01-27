import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VR-ADB | アダルトVR動画レビュー・おすすめ作品紹介",
  description:
    "FANZA VRの人気作品をレビュー。VR AV おすすめランキング、セール情報、女優別作品まとめ。Quest、PSVR対応作品を厳選紹介。",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-256.png", sizes: "256x256", type: "image/png" },
    ],
    apple: "/favicon-256.png",
  },
  openGraph: {
    title: "VR-ADB | アダルトVR動画レビュー",
    description:
      "FANZA VRの人気作品をレビュー。おすすめランキング、セール情報を毎日更新。",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} antialiased`}>{children}</body>
    </html>
  );
}
