import { createFileRoute, notFound, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { ArrowLeft, Users, ShieldAlert, Lock } from "lucide-react";
import { getGameBySlug, GameMode } from "@/lib/games";
import { GameVisualArt } from "@/components/GameVisualArt";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createRoomFn, joinRoomFn } from "@/lib/game.functions";
import { readNickname, saveNickname, saveToken } from "@/lib/session";
import { playClickSound } from "@/lib/sound";

export const Route = createFileRoute("/games/$slug")({
  loader: ({ params }) => {
    const game = getGameBySlug(params.slug);
    if (!game) throw notFound();
    return { game };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.game.title} | Secret Word Room` },
      { name: "description", content: loaderData?.game.shortDescription },
    ],
  }),
  component: GameDetailPage,
});

function HostGameForm({ gameMode, gameTitle }: { gameMode: GameMode; gameTitle: string }) {
  const navigate = useNavigate();
  const createRoom = useServerFn(createRoomFn);
  const [nickname, setNickname] = useState(() => readNickname());
  const [discussionSeconds, setDiscussionSeconds] = useState(180);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!nickname.trim()) {
      setError("Enter a nickname first.");
      return;
    }
    playClickSound();
    setIsPending(true);
    try {
      saveNickname(nickname.trim());
      const res = await createRoom({
        data: {
          nickname: nickname.trim(),
          discussionSeconds,
          gameMode: gameMode ?? "odd_one_out",
        },
      });
      saveToken(res.code, res.token);
      navigate({ to: "/room/$code", params: { code: res.code } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="panel flex flex-col p-6 h-full relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <span className="rounded-full bg-primary/20 text-primary border border-primary/30 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
            <Lock className="w-3 h-3" /> Locked Mode
          </span>
        </div>
        <h2 className="text-2xl font-bold text-white">Host {gameTitle}</h2>
        <p className="mt-1 text-sm text-gray-400">
          Create a private room locked to this game. You'll get a code to share with friends.
        </p>

        <div className="mt-6 space-y-5">
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
              Host Nickname
            </label>
            <Input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="e.g. Maverick"
              maxLength={18}
              className="h-12 text-base bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              aria-label="Nickname"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2 flex justify-between">
              <span>Discussion Timer</span>
              <span className="text-primary font-mono font-bold">{discussionSeconds}s</span>
            </label>
            <input
              id="discussion"
              type="range"
              min={30}
              max={420}
              step={15}
              value={discussionSeconds}
              onChange={(e) => setDiscussionSeconds(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex gap-2 mt-2">
              {[60, 120, 180, 300].map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setDiscussionSeconds(sec);
                  }}
                  className={`flex-1 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                    discussionSeconds === sec
                      ? "liquid-glass-primary text-white border-primary/50 shadow-[0_0_12px_var(--color-primary-glow)]"
                      : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 p-3 rounded-2xl bg-white/5 border border-white/10 text-[11px] text-gray-400 flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-primary shrink-0" />
          <span>Game mode cannot be altered inside room to preserve fair play.</span>
        </div>

        <Button
          type="submit"
          variant="hero"
          size="xl"
          className="mt-6 w-full rounded-full font-bold uppercase tracking-wider liquid-glass-primary text-white shadow-[0_0_25px_var(--color-primary-glow)] hover:scale-[1.02] active:scale-95 transition-all"
          disabled={isPending}
        >
          {isPending ? "Creating Room…" : `Host ${gameTitle}`}
        </Button>

        {error && (
          <p role="alert" className="mt-4 text-sm font-medium text-red-400 text-center">
            {error}
          </p>
        )}
      </div>
    </form>
  );
}

function JoinGameForm() {
  const navigate = useNavigate();
  const joinRoom = useServerFn(joinRoomFn);
  const [nickname, setNickname] = useState(() => readNickname());
  const [code, setCode] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!nickname.trim()) {
      setError("Enter a nickname first.");
      return;
    }
    if (!code.trim()) {
      setError("Enter a room code.");
      return;
    }
    playClickSound();
    setIsPending(true);
    try {
      saveNickname(nickname.trim());
      const res = await joinRoom({
        data: {
          code: code.trim().toUpperCase(),
          nickname: nickname.trim(),
        },
      });
      saveToken(res.code, res.token);
      navigate({ to: "/room/$code", params: { code: res.code } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not join the room.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="panel flex flex-col p-6"
    >
      <h2 className="text-xl font-bold text-white">Have a Room Code?</h2>
      <p className="mt-1 text-sm text-gray-400">Join a friend's game instantly.</p>

      <div className="mt-6 space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
            Your Nickname
          </label>
          <Input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="e.g. Phoenix"
            maxLength={18}
            className="h-12 text-base bg-white/5 border-white/10 text-white placeholder:text-gray-500"
            aria-label="Nickname"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
            Room Code
          </label>
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="ABC12"
            maxLength={6}
            autoCapitalize="characters"
            className="code-chip h-16 text-center text-3xl font-bold tracking-[0.2em] bg-white/5 border-white/10 text-primary"
            aria-label="Room code"
          />
        </div>
      </div>

      <Button
        type="submit"
        size="xl"
        className="mt-6 w-full rounded-full font-bold uppercase tracking-wider border border-white/20 bg-white/10 hover:bg-white/15 text-white hover:border-white/30 backdrop-blur-md hover:scale-[1.02] active:scale-95 transition-all shadow-md"
        disabled={isPending}
      >
        {isPending ? "Connecting…" : "Join Room"}
      </Button>

      {error && (
        <p role="alert" className="mt-4 text-sm font-medium text-red-400 text-center">
          {error}
        </p>
      )}
    </form>
  );
}

function GameDetailPage() {
  const { game } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-black pb-20">
      {/* Header Banner */}
      <div className="relative min-h-[380px] sm:min-h-[460px] w-full bg-black flex flex-col justify-end">
        <div className="absolute inset-0 overflow-hidden">
          <GameVisualArt gameId={game.id} mode="banner" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 pt-4 pb-8 sm:pb-12">
          <Link
            to="/games"
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-300 hover:text-white mb-4 sm:mb-6 transition-colors bg-black/40 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Library
          </Link>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
            <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary border border-primary/30">
              {game.genre}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
              <Users className="w-3 h-3" />
              {game.playerCount}
            </span>
          </div>

          <h1 className="text-3xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-tight sm:leading-none mb-3 sm:mb-4">
            {game.title}
          </h1>
          <p className="max-w-2xl text-base sm:text-xl text-gray-300 font-medium leading-relaxed">
            {game.shortDescription}
          </p>
        </div>
      </div>

      {/* Main Content Details & Host Form */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 mt-6 sm:mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: About & How to play */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8 sm:space-y-12">
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 border-b border-white/10 pb-2">
                About the Game
              </h2>
              <p className="text-gray-300 leading-relaxed text-base sm:text-lg">
                {game.fullDescription}
              </p>
            </section>

            {game.instructions && game.instructions.length > 0 && (
              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 border-b border-white/10 pb-2">
                  How to Play
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {game.instructions.map((inst) => (
                    <div
                      key={inst.step}
                      className="liquid-glass-card border border-white/15 rounded-2xl p-5 sm:p-6 relative overflow-hidden shadow-md"
                    >
                      <div className="text-4xl sm:text-5xl font-black text-white/5 absolute -top-1 -right-1 select-none font-mono">
                        {inst.step}
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-sky-400 mb-2 relative z-10">
                        {inst.step}. {inst.title}
                      </h3>
                      <p className="text-gray-300 text-xs sm:text-sm leading-relaxed relative z-10">
                        {inst.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="liquid-glass-card border border-red-500/25 bg-red-500/10 rounded-2xl p-5 sm:p-6 flex items-start gap-3 sm:gap-4 shadow-md">
              <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-red-400 font-bold mb-1 text-sm sm:text-base">Privacy Notice</h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  Secret roles and words are strictly protected. Ensure nobody can see your screen
                  when you reveal your card. Role distribution logic is securely handled on the
                  server.
                </p>
              </div>
            </section>
          </div>

          {/* Right: Host and Join Forms */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            <div className="lg:sticky lg:top-24 space-y-6">
              {game.gameMode ? (
                <>
                  <HostGameForm gameMode={game.gameMode} gameTitle={game.title} />
                  <JoinGameForm />
                </>
              ) : (
                <div className="panel p-6 sm:p-8 text-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🚧</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Coming Soon</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    This game is currently in development and will be available in a future update.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
