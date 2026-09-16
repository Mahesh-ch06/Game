import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, useEffect } from "react";
import { ArrowLeft, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getRoomHistoryFn } from "@/lib/game.functions";
import { readToken } from "@/lib/session";

export const Route = createFileRoute("/room_/$code/history")({
  head: ({ params }) => ({
    meta: [
      { title: `Room ${params.code} History — Odd One Out` },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: RoomHistoryPage,
});

function RoomHistoryPage() {
  const { code } = Route.useParams();
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setToken(readToken(code));
    setIsReady(true);
  }, [code]);

  if (!isReady) {
    return (
      <main className="flex min-h-screen items-center justify-center px-5">
        <p className="text-sm text-gray-400">Loading…</p>
      </main>
    );
  }

  if (!token) {
    return (
      <main className="flex min-h-screen items-center justify-center px-5">
        <div className="text-center space-y-4">
          <p className="text-sm text-gray-400">You're not in this room.</p>
          <Link
            to="/room/$code"
            params={{ code }}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-black hover:bg-white"
          >
            Join first
          </Link>
        </div>
      </main>
    );
  }

  return <HistoryView code={code} token={token} />;
}

function HistoryView({ code, token }: { code: string; token: string }) {
  const getHistory = useServerFn(getRoomHistoryFn);
  const { data, isLoading } = useQuery({
    queryKey: ["room-history", code, token],
    queryFn: () => getHistory({ data: { token } }),
  });

  return (
    <main className="mx-auto w-full max-w-3xl px-4 sm:px-6 py-8 sm:py-12">
      <header className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Room {code}</p>
          <h1 className="mt-1 text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
            Round History
          </h1>
        </div>
        <Link to="/room/$code" params={{ code }}>
          <Button variant="surface" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to game
          </Button>
        </Link>
      </header>

      {isLoading ? (
        <p className="mt-12 text-center text-sm text-gray-400">Loading round history…</p>
      ) : !data || data.rounds.length === 0 ? (
        <div className="panel mt-8 p-8 text-center animate-slide-up">
          <p className="text-lg font-bold text-white">No completed rounds yet</p>
          <p className="mt-2 text-sm text-gray-400">
            Play a few rounds and come back to see the history.
          </p>
        </div>
      ) : (
        <>
          {/* Leaderboard Card */}
          <section className="panel mt-8 p-5 sm:p-6 animate-slide-up">
            <h2 className="flex items-center gap-2 text-base sm:text-lg font-bold text-white">
              <Trophy className="w-5 h-5 text-primary" /> Leaderboard
            </h2>
            <ul className="mt-4 space-y-2.5">
              {data.players.map((p, idx) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 text-sm"
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                        idx === 0
                          ? "bg-primary text-black"
                          : idx === 1
                            ? "bg-gray-400 text-black"
                            : "bg-white/10 text-gray-400"
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="font-bold text-white">{p.nickname}</span>
                  </span>
                  <span className="font-black text-primary text-base sm:text-lg">{p.score} pts</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Rounds List */}
          <div className="mt-6 space-y-4">
            {data.rounds.map((round) => (
              <section
                key={round.roundNumber}
                className="panel p-5 sm:p-6 space-y-3 animate-slide-up"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Round {round.roundNumber} · {round.category}
                  </p>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      round.minorityCaught
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-red-500/20 text-red-400 border border-red-500/30"
                    }`}
                  >
                    {round.minorityCaught ? "Imposter Caught" : "Imposter Escaped"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="rounded-lg bg-white/5 p-3">
                    <p className="text-[10px] font-semibold uppercase text-gray-400">Majority Word</p>
                    <p className="font-bold text-white text-base mt-1">{round.majorWord}</p>
                  </div>
                  <div className="rounded-lg bg-primary/10 border border-primary/20 p-3">
                    <p className="text-[10px] font-semibold uppercase text-primary">Odd / Chameleon</p>
                    <p className="font-bold text-primary text-base mt-1">{round.minorWord}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between text-xs text-gray-400 pt-2 border-t border-white/5">
                  <p>
                    Odd player: <span className="font-bold text-white">{round.minorityNickname}</span>
                  </p>
                  <p>
                    Voted out: <span className="font-bold text-white">{round.votedOutNickname}</span>
                  </p>
                </div>
              </section>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
