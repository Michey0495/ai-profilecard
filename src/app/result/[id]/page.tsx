import { kv } from "@vercel/kv";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { ShareButtons } from "@/components/ShareButtons";
import { AnimatedStats } from "@/components/AnimatedStats";
import { CardDownload } from "@/components/CardDownload";
import { CardReveal } from "@/components/CardReveal";
import type { ProfileResult } from "@/types";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-profilecard.ezoai.jp";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const result = await kv.get<ProfileResult>(`profilecard:${id}`);

  if (!result) {
    return { title: "結果が見つかりません" };
  }

  const title = `${result.input.name}のプロフカード: ${result.title}`;
  const desc = result.catchcopy;

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      url: `${siteUrl}/result/${id}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
    },
  };
}

export default async function ResultPage({ params }: Props) {
  const { id } = await params;
  const result = await kv.get<ProfileResult>(`profilecard:${id}`);

  if (!result) {
    notFound();
  }

  const shareText = `AIプロフカードで自己紹介カードを作ったら「${result.title}」って言われた\n\n${result.catchcopy}\n\nあなたもプロフカードを作ってみませんか?`;
  const shareUrl = `${siteUrl}/result/${id}`;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black tracking-tight mb-2">
          <span className="text-sky-400">{"//"}</span> プロフカード
        </h1>
        <p className="text-white/50 text-sm">AIが生成したプロフィールカード</p>
      </div>

      {/* Profile Card */}
      <CardReveal>
      <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden mb-6">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sky-400 text-xs font-bold tracking-widest mb-2">
                {result.type}
              </p>
              <p className="text-white font-black text-2xl">
                {result.input.name}
              </p>
              <p className="text-sky-400 font-bold text-lg mt-1">
                {result.title}
              </p>
            </div>
          </div>
          <p className="text-white/60 text-sm mt-3 leading-relaxed">
            {result.catchcopy}
          </p>
        </div>

        {/* Description */}
        <div className="p-6 border-b border-white/10">
          <p className="text-white/40 text-xs font-medium mb-2">ABOUT</p>
          <p className="text-white/70 text-sm leading-relaxed">
            {result.description}
          </p>
        </div>

        {/* Stats */}
        <div className="p-6 border-b border-white/10">
          <p className="text-white/40 text-xs font-medium mb-4">STATUS</p>
          <AnimatedStats stats={result.stats} />
        </div>

        {/* Hashtags */}
        {result.hashtags.length > 0 && (
          <div className="p-6 border-b border-white/10">
            <p className="text-white/40 text-xs font-medium mb-3">TAGS</p>
            <div className="flex flex-wrap gap-2">
              {result.hashtags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-sky-500/10 text-sky-400 text-xs px-3 py-1.5 rounded-full border border-sky-400/20"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Interests */}
        <div className="p-6 border-b border-white/10">
          <p className="text-white/40 text-xs font-medium mb-2">INTERESTS</p>
          <p className="text-white/60 text-sm">{result.input.interests}</p>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-white/[0.02] border-t border-white/10 flex justify-between items-center">
          <span className="text-white/30 text-xs">by AIプロフカード</span>
          <span className="text-white/20 text-xs">ai-profilecard.ezoai.jp</span>
        </div>
      </div>

      </CardReveal>

      {/* Share */}
      <div className="space-y-4">
        <ShareButtons shareText={shareText} shareUrl={shareUrl} />
        <CardDownload cardId={id} />
        <Link
          href="/"
          className="block w-full bg-sky-500 text-white font-bold px-8 py-3 rounded-lg text-center hover:bg-sky-600 transition-all duration-200 cursor-pointer"
        >
          自分もプロフカードを作る
        </Link>
      </div>
    </div>
  );
}
