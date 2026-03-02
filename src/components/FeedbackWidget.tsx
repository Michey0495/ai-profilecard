"use client";

import { useState } from "react";
import { toast } from "sonner";

export function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"bug" | "feature" | "other">("other");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) return;
    setSending(true);
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, message, repo: "ai-profilecard" }),
      });
      toast.success("フィードバックを送信しました");
      setMessage("");
      setTimeout(() => setOpen(false), 2000);
    } catch {
      toast.error("送信に失敗しました");
    } finally {
      setSending(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-white/10 text-white/60 text-xs px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/20 transition-all duration-200 cursor-pointer"
      >
        Feedback
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-72 bg-zinc-900 border border-white/10 rounded-xl p-4 space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-white">フィードバック</span>
        <button
          onClick={() => setOpen(false)}
          aria-label="フィードバックを閉じる"
          className="text-white/40 hover:text-white/70 text-xs cursor-pointer"
        >
          閉じる
        </button>
      </div>
      <div className="flex gap-2">
        {(["bug", "feature", "other"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`text-xs px-2.5 py-1 rounded-full border transition-all duration-200 cursor-pointer ${
              type === t
                ? "bg-sky-500/20 border-sky-400/50 text-sky-300"
                : "bg-white/5 border-white/10 text-white/50"
            }`}
          >
            {t === "bug" ? "バグ" : t === "feature" ? "要望" : "その他"}
          </button>
        ))}
      </div>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="詳細を入力..."
        maxLength={1000}
        rows={3}
        aria-label="フィードバック内容"
        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-sky-400/50 resize-none"
      />
      <button
        onClick={handleSubmit}
        disabled={sending || !message.trim()}
        className="w-full bg-sky-500 text-white text-sm font-medium py-2 rounded-lg hover:bg-sky-600 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {sending ? "送信中..." : "送信"}
      </button>
    </div>
  );
}
