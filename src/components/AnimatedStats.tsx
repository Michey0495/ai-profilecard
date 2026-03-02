"use client";

import { useEffect, useState } from "react";

interface Stat {
  label: string;
  value: number;
}

export function AnimatedStats({ stats }: { stats: Stat[] }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-3">
      {stats.map((stat, i) => (
        <div key={i} style={{ animationDelay: `${i * 100}ms` }}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-white/70 text-sm">{stat.label}</span>
            <span className="text-sky-400 text-sm font-bold">{stat.value}</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div
              className="bg-sky-400 h-2 rounded-full transition-all duration-700 ease-out"
              style={{
                width: animated ? `${stat.value}%` : "0%",
                transitionDelay: `${i * 100 + 200}ms`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
