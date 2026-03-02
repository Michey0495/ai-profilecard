"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface HistoryEntry {
  id: string;
  name: string;
  title: string;
  style: string;
  createdAt: string;
}

const STORAGE_KEY = "profilecard_history";
const MAX_ENTRIES = 5;

export function saveToHistory(entry: HistoryEntry) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const history: HistoryEntry[] = raw ? JSON.parse(raw) : [];
    const filtered = history.filter((h) => h.id !== entry.id);
    filtered.unshift(entry);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(filtered.slice(0, MAX_ENTRIES))
    );
  } catch {
    // localStorage unavailable
  }
}

const accentMap: Record<string, string> = {
  cool: "text-sky-400",
  cute: "text-pink-400",
  dark: "text-violet-400",
  creative: "text-amber-400",
};

export function CardHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setHistory(JSON.parse(raw));
    } catch {
      // localStorage unavailable
    }
  }, []);

  if (history.length === 0) return null;

  return (
    <section className="mt-12 space-y-4">
      <h2 className="text-white/50 text-xs tracking-widest uppercase text-center">
        History
      </h2>
      <div className="space-y-2">
        {history.map((entry) => (
          <Link
            key={entry.id}
            href={`/result/${entry.id}`}
            className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-4 py-3 hover:bg-white/10 transition-all duration-200 cursor-pointer"
          >
            <div className="min-w-0">
              <span className="text-white text-sm font-bold">
                {entry.name}
              </span>
              <span
                className={`${accentMap[entry.style] ?? "text-sky-400"} text-sm ml-2`}
              >
                {entry.title}
              </span>
            </div>
            <span className="text-white/30 text-xs shrink-0 ml-3">
              {new Date(entry.createdAt).toLocaleDateString("ja-JP", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
