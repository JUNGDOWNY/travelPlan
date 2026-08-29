import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "다운 & 민지 & 윤경 · 핀란드, 오스트리아 여행계획",
  description: "날짜별 일정과 지도, 바우처를 한 곳에서.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        {/* SUIT Variable (jsDelivr CDN) — 실제 글꼴 이름은 'SUIT Variable' */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/sun-typeface/SUIT@2/fonts/variable/woff2/SUIT-Variable.css"
        />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
