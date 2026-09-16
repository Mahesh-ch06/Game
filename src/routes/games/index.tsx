import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Search, X, Sparkles, Filter } from "lucide-react";
import { games } from "@/lib/games";
import { Input } from "@/components/ui/input";
import { GameCard } from "@/components/GameCard";

export const Route = createFileRoute("/games/")({
  head: () => ({
    meta: [
      { title: "Games Library | Secret Word Room" },
      {
        name: "description",
        content: "Discover and play the best multiplayer party and deduction games.",
      },
    ],
  }),
  component: GamesPage,
});

const CATEGORIES = [
  { id: "all", label: "All Games" },
  { id: "Social Deduction", label: "Social Deduction" },
  { id: "Word Game", label: "Word Games" },
  { id: "available", label: "Ready to Play" },
];

function GamesPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filtered = useMemo(() => {
    return games.filter((g) => {
      const matchesSearch =
        search.trim() === "" ||
        g.title.toLowerCase().includes(search.toLowerCase()) ||
        g.genre.toLowerCase().includes(search.toLowerCase()) ||
        g.shortDescription.toLowerCase().includes(search.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedCategory === "all") return true;
      if (selectedCategory === "available") return g.status === "available";
      return g.genre.toLowerCase().includes(selectedCategory.toLowerCase());
    });
  }, [search, selectedCategory]);

  return (
    <div className="min-h-screen bg-transparent py-6 sm:py-12 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <header className="mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-sky-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Web Multiplayer</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Game Library
          </h1>
          <p className="mt-2.5 text-base sm:text-lg text-gray-400 max-w-2xl">
            Explore our curated multiplayer social deduction, party, and strategy games. Host
            a room, share the code, and play immediately on any device.
          </p>

          {/* Search bar & Category Filters */}
          <div className="mt-6 sm:mt-8 space-y-4">
            <div className="flex items-center max-w-md w-full relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search games, words, or genres..."
                className="pl-11 sm:pl-12 pr-10 h-11 sm:h-12 liquid-glass-card border border-white/15 text-white placeholder:text-gray-400 focus-visible:ring-primary focus-visible:border-primary/50 rounded-full text-sm sm:text-base shadow-sm"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`shrink-0 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
                      isActive
                        ? "liquid-glass-primary text-white shadow-[0_0_15px_var(--color-primary-glow)] scale-105"
                        : "border border-white/15 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        {/* Game Cards Grid */}
        {filtered.length > 0 ? (
          <div>
            <div className="mb-4 text-xs sm:text-sm font-medium text-gray-400">
              Showing <span className="text-white font-bold">{filtered.length}</span> {filtered.length === 1 ? "game" : "games"}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
              {filtered.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </div>
        ) : (
          <div className="py-16 text-center liquid-glass-card rounded-2xl sm:rounded-3xl border border-white/15 max-w-md mx-auto p-8">
            <Filter className="w-10 h-10 text-gray-500 mx-auto mb-3" />
            <p className="text-white text-base sm:text-lg font-bold mb-1">
              No games found
            </p>
            <p className="text-gray-400 text-sm mb-5">
              We couldn't find any games matching your current search or filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedCategory("all");
              }}
              className="rounded-full liquid-glass-primary px-5 py-2 text-xs font-bold text-white shadow-md hover:scale-105 active:scale-95 transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
