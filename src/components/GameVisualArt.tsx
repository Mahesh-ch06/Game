import React from "react";
import { EyeOff, Ghost, Skull, Target, PenTool, LucideIcon } from "lucide-react";

interface GameTheme {
  gradient: string;
  border: string;
  badgeBg: string;
  badgeText: string;
  accentColor: string;
  icon: LucideIcon;
  tagline: string;
  pattern: string;
}

const defaultTheme: GameTheme = {
  gradient: "from-purple-950/90 via-indigo-950/70 to-zinc-950",
  border: "border-purple-500/30",
  badgeBg: "bg-purple-500/10 border border-purple-500/30",
  badgeText: "text-purple-400",
  accentColor: "#a855f7",
  icon: EyeOff,
  tagline: "1 SECRET WORD · 1 IMPOSTER",
  pattern: "radial-purple",
};

const gameThemes: Record<string, GameTheme> = {
  odd_one_out: defaultTheme,
  word_chameleon: {
    gradient: "from-emerald-950/90 via-teal-950/70 to-zinc-950",
    border: "border-emerald-500/30",
    badgeBg: "bg-emerald-500/10 border border-emerald-500/30",
    badgeText: "text-emerald-400",
    accentColor: "#10b981",
    icon: Ghost,
    tagline: "NO SECRET WORD · BLEND IN",
    pattern: "radial-emerald",
  },
  mafia: {
    gradient: "from-red-950/90 via-rose-950/70 to-zinc-950",
    border: "border-red-500/30",
    badgeBg: "bg-red-500/10 border border-red-500/30",
    badgeText: "text-red-400",
    accentColor: "#ef4444",
    icon: Skull,
    tagline: "MAFIA VS TOWN · DECEPTION",
    pattern: "radial-red",
  },
  spy_words: {
    gradient: "from-blue-950/90 via-cyan-950/70 to-zinc-950",
    border: "border-cyan-500/30",
    badgeBg: "bg-cyan-500/10 border border-cyan-500/30",
    badgeText: "text-cyan-400",
    accentColor: "#06b6d4",
    icon: Target,
    tagline: "SPY NETWORK · TEAM STRATEGY",
    pattern: "radial-cyan",
  },
  blank_slate: {
    gradient: "from-amber-950/90 via-orange-950/70 to-zinc-950",
    border: "border-amber-500/30",
    badgeBg: "bg-amber-500/10 border border-amber-500/30",
    badgeText: "text-amber-400",
    accentColor: "#f59e0b",
    icon: PenTool,
    tagline: "MIND MATCH · WORD PUZZLE",
    pattern: "radial-amber",
  },
};

interface GameVisualArtProps {
  gameId: string;
  className?: string;
  mode?: "card" | "banner";
}

export function GameVisualArt({ gameId, className = "", mode = "card" }: GameVisualArtProps) {
  const theme: GameTheme = gameThemes[gameId] ?? defaultTheme;
  const Icon = theme.icon;

  if (mode === "banner") {
    return (
      <div className={`relative w-full h-full bg-gradient-to-br ${theme.gradient} overflow-hidden ${className}`}>
        <div
          className="absolute -top-20 -left-20 w-96 h-96 rounded-full blur-3xl opacity-30"
          style={{ backgroundColor: theme.accentColor }}
        />
        <div
          className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: theme.accentColor }}
        />
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute right-12 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none transform rotate-12 scale-150">
          <Icon className="w-80 h-80 text-white" />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full bg-gradient-to-b ${theme.gradient} overflow-hidden p-6 flex flex-col justify-between ${className}`}>
      <div
        className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-2xl opacity-30"
        style={{ backgroundColor: theme.accentColor }}
      />
      <div
        className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full blur-2xl opacity-20"
        style={{ backgroundColor: theme.accentColor }}
      />
      <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:20px_20px]" />
      <div className="relative z-10 mt-6 sm:mt-10 mb-auto flex flex-col items-center justify-center pt-2">
        <div className="relative flex items-center justify-center">
          <div
            className="absolute inset-0 rounded-full blur-md opacity-40 animate-pulse"
            style={{ backgroundColor: theme.accentColor }}
          />
          <div
            className={`relative p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-black/60 backdrop-blur-xl border ${theme.border} shadow-2xl transition-transform duration-500 group-hover:scale-110`}
          >
            <Icon className="w-9 h-9 sm:w-14 sm:h-14" style={{ color: theme.accentColor }} />
          </div>
        </div>
      </div>
    </div>
  );
}
