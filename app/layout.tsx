import type { Metadata } from "next";
import Script from "next/script";
import { Geist } from "next/font/google";
import { MobileNav } from "@/components/mobile-nav";
import { WebsiteJsonLd, OrganizationJsonLd, WebSiteJsonLd } from "@/components/json-ld";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-9CRFFSVGZ7";
const CLARITY_PROJECT_ID = "wh71zd24kw";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vr-adb.com"),
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
    images: [
      {
        url: "https://vr-adb.com/ogp/top_ogp.png",
        width: 1200,
        height: 630,
        alt: "VR-ADB | アダルトVR動画レビュー",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VR-ADB | アダルトVR動画レビュー",
    description:
      "FANZA VRの人気作品をレビュー。おすすめランキング、セール情報を毎日更新。",
    images: ["https://vr-adb.com/ogp/top_ogp.png"],
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
        {/* Microsoft Clarity */}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
          `}
        </Script>
      </head>
      <body className={`${geistSans.variable} antialiased`}>
        <WebsiteJsonLd
          url="https://vr-adb.com"
          name="VR-ADB"
          description="FANZA VRの人気作品をレビュー。VR AV おすすめランキング、セール情報、女優別作品まとめ。"
        />
        {/* サイト全体の構造化データ */}
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        {children}
        <MobileNav />
      </body>
    </html>
  );
}
