import React, { useState, useEffect, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Users, Flame, Activity, Play, ArrowRight } from "lucide-react";
import { games } from "@/lib/games";
import { GameVisualArt } from "./GameVisualArt";

export function FeaturedGamesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % games.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + games.length) % games.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const currentGame = games[currentIndex] ?? games[0];
  if (!currentGame) return null;

  const totalPlayed = currentGame.stats?.totalPlayed ?? 0;
  const currentlyPlaying = currentGame.stats?.currentlyPlaying ?? 0;

  return (
    <section className="relative py-12 sm:py-20 bg-gradient-to-b from-black via-zinc-950/80 to-black overflow-hidden border-y border-white/5">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-black uppercase tracking-[0.25em] text-primary">
                Featured Games Carousel
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tighter text-white">
              Explore Featured Games
            </h2>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              onClick={prevSlide}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              aria-label="Previous Game"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-all hover:bg-primary hover:text-black hover:border-primary active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1.5 px-3">
              {games.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    i === currentIndex ? "w-8 bg-primary" : "w-2.5 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={nextSlide}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              aria-label="Next Game"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-all hover:bg-primary hover:text-black hover:border-primary active:scale-95 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Slide Card */}
        <div
          className="relative min-h-[420px] sm:min-h-[480px] w-full rounded-2xl sm:rounded-3xl bg-zinc-900/60 border border-white/10 p-4 sm:p-10 lg:p-12 backdrop-blur-xl overflow-hidden shadow-2xl"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentGame.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
            >
              {/* Visual Left Side */}
              <div className="lg:col-span-6 relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] w-full rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
                <div className="absolute inset-0 bg-primary/10 blur-[80px] rounded-full" />
                <GameVisualArt
                  gameId={currentGame.id}
                  mode="card"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                <div className="absolute top-2.5 sm:top-4 left-2.5 sm:left-4 right-2.5 sm:right-4 flex items-center justify-between gap-1.5 z-10">
                  <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-black/70 border border-white/15 text-[10px] sm:text-xs font-extrabold text-white backdrop-blur-md">
                    <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
                    {currentGame.playerCount}
                  </span>
                  <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[10px] sm:text-xs font-extrabold text-emerald-400 backdrop-blur-md">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    {currentlyPlaying.toLocaleString()} Playing Now
                  </span>
                </div>
              </div>

              {/* Text Info Right Side */}
              <div className="lg:col-span-6 flex flex-col items-start justify-center">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5 mb-3 sm:mb-4">
                  <span className="rounded-full bg-primary/20 border border-primary/30 px-2.5 sm:px-3.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-black uppercase tracking-wider text-primary">
                    {currentGame.genre}
                  </span>
                  <span className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold text-orange-400">
                    <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-400" />
                    {totalPlayed.toLocaleString()} Plays
                  </span>
                  <span className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full bg-white/5 border border-white/10 px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold text-gray-300">
                    <Activity className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
                    {currentGame.status === "available" ? "Live Game" : "Coming Soon"}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-4xl lg:text-6xl font-black uppercase tracking-tight text-white mb-3 sm:mb-4 leading-none">
                  {currentGame.title}
                </h3>
                <p className="text-sm sm:text-base lg:text-lg text-gray-300 font-medium leading-relaxed mb-4 sm:mb-6 max-w-xl">
                  {currentGame.shortDescription}
                </p>

                {currentGame.features && currentGame.features.length > 0 && (
                  <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8 w-full">
                    {currentGame.features.slice(0, 4).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                )}

                {currentGame.status === "available" ? (
                  <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                    <Link
                      to="/games/$slug"
                      params={{ slug: currentGame.slug }}
                      className="inline-flex items-center justify-center gap-3 rounded-full bg-primary px-8 py-3.5 text-sm font-black uppercase tracking-widest text-black shadow-lg shadow-primary/25 transition-transform hover:scale-105 hover:bg-white cursor-pointer w-full sm:w-auto"
                    >
                      <Play className="w-4 h-4 fill-current" /> PLAY NOW
                    </Link>
                    <Link
                      to="/games/$slug"
                      params={{ slug: currentGame.slug }}
                      className="inline-flex items-center justify-center gap-2 text-sm font-bold text-gray-300 hover:text-white transition-colors py-2 px-4"
                    >
                      How to play <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-gray-400">
                    Coming Soon
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
