import React from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Flame, Users, Play } from "lucide-react";
import { Game } from "@/lib/games";
import { GameVisualArt } from "./GameVisualArt";

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  const isAvailable = game.status === "available";
  const totalPlayed = game.stats?.totalPlayed ?? 0;
  const currentlyPlaying = game.stats?.currentlyPlaying ?? 0;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group relative flex aspect-[3/4] w-full flex-col overflow-hidden rounded-xl sm:rounded-2xl bg-neutral-900 border border-white/10 shadow-2xl"
    >
      <div className="absolute inset-0 z-0">
        <GameVisualArt gameId={game.id} mode="card" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-95 transition-opacity duration-300 z-5" />

      {/* Top badges */}
      <div className="absolute top-2.5 sm:top-4 left-2.5 sm:left-4 right-2.5 sm:right-4 flex items-center justify-between gap-1.5 z-10">
        <span className="inline-flex items-center gap-1 rounded-full bg-black/75 border border-white/15 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-extrabold text-orange-400 backdrop-blur-md">
          <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-orange-400" />
          {totalPlayed.toLocaleString()}
        </span>
        {isAvailable && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-500/35 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-extrabold text-emerald-400 backdrop-blur-md">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            {currentlyPlaying.toLocaleString()}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-end p-3 sm:p-6 md:p-8 pointer-events-none">
        <div className="mb-1 sm:mb-2 flex items-center gap-2 text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-primary">
          <span className="px-1.5 sm:px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20">
            {game.genre}
          </span>
        </div>
        <h3 className="text-base sm:text-2xl md:text-3xl font-black text-white leading-tight tracking-tight">
          {game.title}
        </h3>
        <div className="mt-1 sm:mt-2 flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-bold text-gray-300">
          <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
          {game.playerCount}
        </div>
        <div className="mt-2 sm:mt-4 pt-1 sm:pt-2">
          {isAvailable ? (
            <div className="flex w-full items-center justify-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl bg-primary py-2 sm:py-3 text-[10px] sm:text-sm font-black text-white shadow-lg shadow-primary/30 group-hover:bg-primary-dark transition-colors">
              <Play className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
              PLAY NOW
            </div>
          ) : (
            <div className="flex w-full items-center justify-center rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-md border border-white/15 py-2 sm:py-3 text-[10px] sm:text-sm font-bold tracking-widest text-gray-300 uppercase">
              Coming Soon
            </div>
          )}
        </div>
      </div>

      {/* Link layer */}
      {isAvailable ? (
        <Link
          to="/games/$slug"
          params={{ slug: game.slug }}
          className="absolute inset-0 z-30 block w-full h-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary rounded-2xl"
        >
          <span className="sr-only">Play {game.title}</span>
        </Link>
      ) : (
        <div className="absolute inset-0 z-30 block w-full h-full cursor-not-allowed">
          <span className="sr-only">Coming Soon: {game.title}</span>
        </div>
      )}
    </motion.div>
  );
}
