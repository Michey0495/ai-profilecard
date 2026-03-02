import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <h1 className="text-2xl font-black text-white mb-4">
        ページが見つかりません
      </h1>
      <p className="text-white/50 text-sm mb-8">
        お探しのページは存在しないか、有効期限が切れています。
      </p>
      <Link
        href="/"
        className="bg-sky-500 text-white font-bold px-8 py-3 rounded-lg hover:bg-sky-600 transition-all duration-200 cursor-pointer inline-block"
      >
        トップに戻る
      </Link>
    </div>
  );
}
