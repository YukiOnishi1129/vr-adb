import type { Metadata } from "next";
import Script from "next/script";
import { Geist } from "next/font/google";
import { MobileNav } from "@/components/mobile-nav";
import { WebsiteJsonLd } from "@/components/json-ld";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-9CRFFSVGZ7";

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
      <head>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </head>
      <body className={`${geistSans.variable} antialiased`}>
        <WebsiteJsonLd
          url="https://vr-adb.com"
          name="VR-ADB"
          description="FANZA VRの人気作品をレビュー。VR AV おすすめランキング、セール情報、女優別作品まとめ。"
        />
        {children}
        <MobileNav />
      </body>
    </html>
  );
}
