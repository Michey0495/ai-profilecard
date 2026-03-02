"use client";

import { toast } from "sonner";

interface ShareButtonsProps {
  shareText: string;
  shareUrl: string;
}

export function ShareButtons({ shareText, shareUrl }: ShareButtonsProps) {
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("リンクをコピーしました");
    } catch {
      toast.error("コピーに失敗しました");
    }
  };

  return (
    <div className="grid grid-cols-3 gap-3">
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="X (Twitter) でプロフカードをシェア"
        className="bg-white/10 text-white font-medium px-4 py-2.5 rounded-lg text-center text-sm hover:bg-white/20 transition-all duration-200 cursor-pointer"
      >
        X でシェア
      </a>
      <a
        href={lineUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LINE でプロフカードをシェア"
        className="bg-[#06C755]/20 text-[#06C755] font-medium px-4 py-2.5 rounded-lg text-center text-sm hover:bg-[#06C755]/30 transition-all duration-200 cursor-pointer"
      >
        LINE でシェア
      </a>
      <button
        onClick={handleCopy}
        aria-label="プロフカードのリンクをコピー"
        className="bg-white/5 text-white/70 font-medium px-4 py-2.5 rounded-lg text-sm border border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer"
      >
        リンクコピー
      </button>
    </div>
  );
}
