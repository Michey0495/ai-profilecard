"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <h1 className="text-2xl font-black text-white mb-4">
        エラーが発生しました
      </h1>
      <p className="text-white/50 text-sm mb-8">
        予期しないエラーが発生しました。もう一度お試しください。
      </p>
      <button
        onClick={reset}
        className="bg-sky-500 text-white font-bold px-8 py-3 rounded-lg hover:bg-sky-600 transition-all duration-200 cursor-pointer"
      >
        もう一度試す
      </button>
    </div>
  );
}
