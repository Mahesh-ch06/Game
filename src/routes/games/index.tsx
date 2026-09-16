import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
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

function GamesPage() {
  const [search, setSearch] = useState("");
  const filtered = games.filter(
    (g) =>
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.genre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-transparent py-6 sm:py-12 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <header className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Game Library
          </h1>
          <p className="mt-3 text-base sm:text-lg text-gray-400 max-w-2xl">
            Explore our collection of multiplayer social deduction, party, and strategy games. Host
            a room, share the code, and play on your phones.
          </p>
          <div className="mt-6 flex items-center max-w-md w-full relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-500" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search games or genres..."
              className="pl-11 sm:pl-12 h-12 sm:h-14 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-primary rounded-full text-sm sm:text-base"
            />
          </div>
        </header>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {filtered.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-gray-400 text-base sm:text-lg">
              No games found matching "{search}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
