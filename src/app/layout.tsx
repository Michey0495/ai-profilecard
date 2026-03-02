import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { FeedbackWidget } from "@/components/FeedbackWidget";
import CrossPromo from "@/components/CrossPromo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-profilecard.ezoai.jp";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  manifest: "/manifest.json",
  title: {
    template: "%s | AIプロフカード",
    default:
      "AIプロフカード - AIが自己紹介カードを自動生成 | 無料・登録不要",
  },
  description:
    "名前と趣味を入力するだけで、AIがオシャレな自己紹介カードを自動生成。SNS映えするプロフィールカードを30秒で作成。無料・登録不要。",
  keywords: [
    "プロフィールカード",
    "自己紹介カード",
    "AI",
    "プロフカード",
    "SNS",
    "自己紹介",
    "プロフィール",
    "名刺",
    "profile card",
    "AI profile",
    "自己紹介メーカー",
  ],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "AIプロフカード - AIがオシャレな自己紹介カードを自動生成",
    description:
      "名前と趣味を入力するだけ。AIがあなただけのプロフィールカードを自動生成。無料・登録不要。",
    url: siteUrl,
    siteName: "AIプロフカード",
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "AIプロフカード - AIがオシャレな自己紹介カードを自動生成",
    description:
      "名前と趣味を入力するだけ。AIがあなただけのプロフィールカードを自動生成。無料・登録不要。",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  return (
    <html lang="ja">
      <head>
        <meta name="theme-color" content="#000000" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        {gaId && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`,
              }}
            />
          </>
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen flex flex-col">
          <main className="flex-1">{children}</main>
          <CrossPromo current="AIプロフカード" />
          <footer className="text-center py-6 text-white/30 text-sm">
            <p>AIプロフカード by Ghostfee &mdash; ai-profilecard.ezoai.jp</p>
          </footer>
        </div>
        <Toaster
          theme="dark"
          position="top-center"
          toastOptions={{
            style: {
              background: "#18181b",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff",
            },
          }}
        />
        <FeedbackWidget />
      </body>
    </html>
  );
}
