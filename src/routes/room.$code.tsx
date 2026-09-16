import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import {
  Users,
  Copy,
  Check,
  Eye,
  EyeOff,
  Clock,
  History,
  Crown,
  Skull,
  Shield,
  Search,
  Sparkles,
  ArrowRight,
  LogOut,
  Play,
  RotateCcw,
  AlertTriangle,
  Volume2,
  VolumeX,
  Share2,
  Lock,
  CheckCircle2,
  QrCode,
  UserPlus,
  X,
  Radio,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  beginDiscussionFn,
  castVoteFn,
  forceResultsFn,
  getStateFn,
  joinRoomFn,
  leaveRoomFn,
  nextRoundFn,
  startRoundFn,
  startVotingFn,
  kickPlayerFn,
  switchGameModeFn,
  guessChameleonWordFn,
  mafiaStartGameFn,
  mafiaNightActionFn,
  mafiaBeginMorningFn,
  mafiaBeginDiscussFn,
  mafiaBeginVoteFn,
  mafiaCastVoteFn,
  mafiaForceVoteResultsFn,
  mafiaNextNightFn,
  mafiaRestartGameFn,
} from "@/lib/game.functions";
import type { GameState, GameMode, MafiaRole, PublicPlayer } from "@/lib/game.server";
import { clearToken, readNickname, readToken, saveNickname, saveToken } from "@/lib/session";
import { supabase } from "@/integrations/supabase/client";
import {
  playClickSound,
  playPeekSound,
  playVoteSound,
  playTickSound,
  playAlarmSound,
  playWinSound,
  playDefeatSound,
  getIsMuted,
  toggleMute,
  triggerHaptic,
} from "@/lib/sound";

export const Route = createFileRoute("/room/$code")({
  head: ({ params }) => {
    const title = `Room ${params.code} — Secret Word Room`;
    const description = `Join room ${params.code} and play party games with friends.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "robots", content: "noindex" },
      ],
    };
  },
  errorComponent: RoomErrorComponent,
  component: RoomPage,
});

function RoomErrorComponent({ reset }: { reset: () => void }) {
  useEffect(() => {
    const t = setTimeout(() => reset(), 150);
    return () => clearTimeout(t);
  }, [reset]);

  return (
    <main className="flex min-h-screen items-center justify-center px-5 text-white">
      <div className="panel max-w-sm p-6 text-center animate-slide-up">
        <span className="text-3xl">⚡</span>
        <p className="mt-2 text-base font-bold">Connecting to room…</p>
        <p className="mt-1 text-xs text-muted-foreground">Syncing live player state</p>
        <Button variant="surface" size="sm" className="mt-4" onClick={() => reset()}>
          Tap to retry
        </Button>
      </div>
    </main>
  );
}

function RoomPage() {
  const { code } = Route.useParams();
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [expired, setExpired] = useState(false);
  const [expiredMessage, setExpiredMessage] = useState<string | null>(null);

  useEffect(() => {
    setToken(readToken(code));
    setReady(true);
  }, [code]);

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center px-5 text-white">
        <p className="text-sm text-muted-foreground animate-pulse">Loading room…</p>
      </main>
    );
  }

  if (expired) {
    return (
      <ExpiredRoom
        code={code}
        message={expiredMessage ?? undefined}
        onRetry={() => {
          setExpired(false);
          setExpiredMessage(null);
        }}
      />
    );
  }

  if (!token) {
    return (
      <RejoinCard
        code={code}
        onJoined={setToken}
        onExpired={(msg) => {
          setExpiredMessage(msg);
          setExpired(true);
        }}
      />
    );
  }

  return (
    <GameController
      code={code}
      token={token}
      onLostSeat={(msg) => {
        setToken(null);
        if (msg && (msg.includes("expired") || msg.includes("no longer exists") || msg.includes("No room found"))) {
          setExpiredMessage(msg);
          setExpired(true);
        }
      }}
    />
  );
}

function ExpiredRoom({
  code,
  message,
  onRetry,
}: {
  code: string;
  message?: string | undefined;
  onRetry?: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 text-white">
      <div className="panel max-w-md w-full p-6 sm:p-8 text-center animate-slide-up">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-400 mb-4 border border-red-500/20">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight">Room Unavailable</h1>
        <p className="mt-2 text-xs sm:text-sm text-gray-400 leading-relaxed">
          {message || `Room ${code} could not be reached or has closed.`}
        </p>
        <div className="mt-6 flex flex-col gap-2.5">
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-primary-dark transition-all shadow-[0_0_15px_var(--color-primary-glow)] cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-2" /> Try Again
            </button>
          )}
          <Link
            to="/games"
            className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            Create New Room
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl border border-white/10 px-5 py-2 text-xs font-medium text-gray-400 hover:text-white transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </main>
  );
}

function RejoinCard({
  code,
  onJoined,
  onExpired,
}: {
  code: string;
  onJoined: (token: string) => void;
  onExpired?: (msg: string) => void;
}) {
  const joinRoom = useServerFn(joinRoomFn);
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const attemptedAutoRef = useRef(false);

  useEffect(() => {
    setNickname(readNickname());
  }, []);

  useEffect(() => {
    if (attemptedAutoRef.current) return;
    const stored = readNickname();
    if (!stored) {
      attemptedAutoRef.current = true;
      return;
    }

    attemptedAutoRef.current = true;
    setIsPending(true);
    setStatusMessage("Connecting to room…");

    let isMounted = true;
    let retries = 0;
    const maxRetries = 3;

    async function attemptAutoJoin() {
      try {
        const res = await joinRoom({ data: { code, nickname: stored } });
        if (!isMounted) return;
        saveToken(res.code, res.token);
        onJoined(res.token);
      } catch (err) {
        if (!isMounted) return;
        const msg = err instanceof Error ? err.message : "";
        // If room is still warming up or committing in Supabase, retry up to 3 times
        if (
          retries < maxRetries &&
          (msg.includes("No room found") ||
            msg.includes("Could not") ||
            msg.includes("fetch") ||
            msg.includes("timeout"))
        ) {
          retries++;
          setStatusMessage(`Connecting to room… (attempt ${retries + 1}/${maxRetries + 1})`);
          setTimeout(attemptAutoJoin, 700 * retries);
          return;
        }

        // Never lock into ExpiredRoom on auto-join failure!
        setIsPending(false);
        setStatusMessage(null);
        if (msg.includes("already in progress") || msg.includes("full")) {
          setError(msg);
        } else {
          setError("Could not automatically connect. Tap 'Enter Room' below to join.");
        }
      }
    }

    attemptAutoJoin();

    return () => {
      isMounted = false;
    };
  }, [code, joinRoom, onJoined]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!nickname.trim()) {
      setError("Enter a nickname first.");
      return;
    }
    setIsPending(true);
    setStatusMessage("Entering room…");
    try {
      saveNickname(nickname.trim());
      const res = await joinRoom({ data: { code, nickname: nickname.trim() } });
      saveToken(res.code, res.token);
      onJoined(res.token);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not join.";
      if (msg.includes("expired") || msg.includes("no longer exists")) {
        onExpired?.(msg);
      } else {
        setError(msg);
      }
    } finally {
      setIsPending(false);
      setStatusMessage(null);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 text-white">
      <form onSubmit={handleSubmit} className="panel max-w-sm w-full p-6 sm:p-8 animate-slide-up">
        <p className="text-xs uppercase font-bold tracking-widest text-primary">Join Room {code}</p>
        <h1 className="mt-1 text-2xl font-black uppercase">Enter Your Name</h1>
        <div className="mt-4">
          <Input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="e.g. Maverick"
            maxLength={18}
            className="h-11 bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-xl text-sm"
            autoFocus
          />
        </div>
        <Button
          type="submit"
          className="mt-4 w-full h-11 font-black uppercase tracking-wider bg-primary text-white hover:bg-primary-dark transition-all rounded-xl text-xs sm:text-sm shadow-[0_0_15px_var(--color-primary-glow)] cursor-pointer"
          disabled={isPending}
        >
          {isPending ? (statusMessage || "Connecting…") : "Enter Room"}
        </Button>
        {error && <p className="mt-3 text-xs text-red-400 text-center font-medium leading-relaxed">{error}</p>}
      </form>
    </main>
  );
}

const AVATAR_COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#10b981",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];

function getAvatarColor(idx: number) {
  return AVATAR_COLORS[idx % AVATAR_COLORS.length]!;
}

function getInitials(name: string) {
  return name.slice(0, 2).toUpperCase();
}

// Floating Emoji Broadcast Reactions
function FloatingEmotes({ code, phase }: { code: string; phase: string }) {
  const [emotes, setEmotes] = useState<{ id: string; emoji: string; x: number; timestamp: number }[]>([]);

  useEffect(() => {
    if (phase !== "discuss" && phase !== "vote" && phase !== "mafia_discuss" && phase !== "mafia_vote") return undefined;
    try {
      const channel = supabase.channel(`room-${code}`);
      channel
        .on("broadcast", { event: "emote" }, (payload: any) => {
          const { emoji, x } = payload.payload;
          setEmotes((prev) => [
            ...prev,
            { id: Math.random().toString(), emoji, x, timestamp: Date.now() },
          ]);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch {}
    return undefined;
  }, [code, phase]);

  // Clean up old floating emotes after 2.5 seconds
  useEffect(() => {
    if (emotes.length === 0) return;
    const interval = setInterval(() => {
      const now = Date.now();
      setEmotes((prev) => prev.filter((e) => now - e.timestamp < 2500));
    }, 500);
    return () => clearInterval(interval);
  }, [emotes.length]);

  const sendEmote = useCallback(
    (emoji: string) => {
      playClickSound();
      triggerHaptic(15);
      const x = Math.floor(Math.random() * 80) + 10;
      setEmotes((prev) => [...prev, { id: Math.random().toString(), emoji, x, timestamp: Date.now() }]);
      try {
        const channel = supabase.channel(`room-${code}`);
        channel.send({ type: "broadcast", event: "emote", payload: { emoji, x } });
      } catch {}
    },
    [code]
  );

  return (
    <>
      {/* Floating emojis layer */}
      <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
        {emotes.map((e) => (
          <div
            key={e.id}
            className="absolute bottom-20 text-3xl sm:text-4xl animate-float-up select-none drop-shadow-lg"
            style={{ left: `${e.x}%` }}
          >
            {e.emoji}
          </div>
        ))}
      </div>

      {/* Emote triggers dock */}
      <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-[90] flex items-center gap-1.5 glass-pill p-1.5 max-w-[94vw] overflow-x-auto no-scrollbar animate-slide-up">
        {["🤔", "🤣", "😱", "🍅", "👀", "🕵️", "🔥", "🤫"].map((em) => (
          <button
            key={em}
            onClick={() => sendEmote(em)}
            className="cursor-pointer shrink-0 rounded-full p-2 text-xl sm:text-2xl transition-all duration-200 hover:scale-135 hover:bg-accent/25 active:scale-90 touch-manipulation"
            title={`React ${em}`}
          >
            {em}
          </button>
        ))}
      </div>
    </>
  );
}

function PhaseCountdownTimer({
  phaseEndsAt,
  onExpire,
}: {
  phaseEndsAt?: string | null;
  onExpire?: () => void;
}) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const warnedRef = useRef(false);

  useEffect(() => {
    if (!phaseEndsAt) {
      setTimeLeft(null);
      return undefined;
    }

    warnedRef.current = false;
    const update = () => {
      const remaining = Math.max(0, Math.ceil((new Date(phaseEndsAt).getTime() - Date.now()) / 1000));
      setTimeLeft(remaining);

      if (remaining > 0 && remaining <= 10) {
        playTickSound();
      }

      if (remaining === 0 && !warnedRef.current) {
        warnedRef.current = true;
        playAlarmSound();
        onExpire?.();
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [phaseEndsAt, onExpire]);

  if (timeLeft === null) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isUrgent = timeLeft <= 10;

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 border font-mono text-sm font-black transition-all ${
        isUrgent
          ? "border-red-500/50 bg-red-500/20 text-red-400 animate-pulse scale-105"
          : "border-primary/30 bg-primary/10 text-primary"
      }`}
    >
      <Clock className={`w-4 h-4 ${isUrgent ? "text-red-400 animate-spin" : "text-primary"}`} />
      <span>
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </span>
      {isUrgent && (
        <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-red-300">
          Hurry!
        </span>
      )}
    </div>
  );
}

// Main Game Controller
function GameController({
  code,
  token,
  onLostSeat,
}: {
  code: string;
  token: string;
  onLostSeat: (msg?: string) => void;
}) {
  const getState = useServerFn(getStateFn);
  const startRound = useServerFn(startRoundFn);
  const beginDiscussion = useServerFn(beginDiscussionFn);
  const startVoting = useServerFn(startVotingFn);
  const castVote = useServerFn(castVoteFn);
  const forceResults = useServerFn(forceResultsFn);
  const nextRound = useServerFn(nextRoundFn);
  const leaveRoom = useServerFn(leaveRoomFn);
  const kickPlayer = useServerFn(kickPlayerFn);
  const guessChameleonWord = useServerFn(guessChameleonWordFn);
  const switchGameMode = useServerFn(switchGameModeFn);

  const { data: state } = useQuery({
    queryKey: ["room", code, token],
    queryFn: () => getState({ data: { token } }),
    refetchInterval: 1500,
    retry: 1,
  });

  const [copied, setCopied] = useState(false);
  const [muted, setMuted] = useState(() => getIsMuted());
  const [revealed, setRevealed] = useState(false);
  const [guessInput, setGuessInput] = useState("");
  const [guessResult, setGuessResult] = useState<{ correct: boolean; word: string } | null>(null);
  const [isActionPending, setIsActionPending] = useState(false);

  // Freeze player word per round on client to eliminate any mid-game flickering or mutations
  const [lockedWord, setLockedWord] = useState<{ round: number; word: string | null; isChameleon: boolean; categoryHint: string | null }>({
    round: -1,
    word: null,
    isChameleon: false,
    categoryHint: null,
  });

  useEffect(() => {
    if (!state || state.round <= 0) return;
    if (lockedWord.round !== state.round && (state.me.word || state.me.isChameleon)) {
      setLockedWord({
        round: state.round,
        word: state.me.word,
        isChameleon: !!state.me.isChameleon,
        categoryHint: state.me.categoryHint ?? null,
      });
    }
  }, [state?.round, state?.me.word, state?.me.isChameleon, state?.me.categoryHint, lockedWord.round]);

  const activeDisplayWord =
    lockedWord.round === state?.round && (lockedWord.word || lockedWord.isChameleon)
      ? lockedWord.word
      : state?.me.word;

  const activeIsChameleon =
    lockedWord.round === state?.round
      ? lockedWord.isChameleon
      : !!state?.me.isChameleon;

  const activeCategoryHint =
    lockedWord.round === state?.round
      ? lockedWord.categoryHint
      : state?.me.categoryHint;

  const prevPhaseRef = useRef<string | null>(null);

  useEffect(() => {
    if (!state) return;
    if (prevPhaseRef.current !== "results" && state.phase === "results" && state.results) {
      const isOdd = state.me.id === state.results.minorityPlayerId;
      const won =
        (isOdd && !state.results.minorityCaught) || (!isOdd && state.results.minorityCaught);
      if (won) playWinSound();
      else playDefeatSound();
    }
    prevPhaseRef.current = state.phase;
  }, [state]);

  if (!state) {
    return (
      <main className="flex min-h-screen items-center justify-center px-5 bg-black text-white">
        <p className="text-sm text-gray-400">Loading room state…</p>
      </main>
    );
  }

  // Branch into Mafia Game if gameMode is mafia
  if (state.gameMode === "mafia") {
    return <MafiaGame state={state} token={token} onLeave={() => leaveRoom({ data: { token } })} />;
  }

  const isHost = state.me.isHost;
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [switchingMode, setSwitchingMode] = useState(false);

  const roomUrl = typeof window !== "undefined" ? `${window.location.origin}/room/${code}` : "";
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    roomUrl
  )}&bgcolor=0f172a&color=22c55e&margin=2`;

  const copyLink = () => {
    playClickSound();
    navigator.clipboard.writeText(roomUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    playClickSound();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Secret Word Room — Room ${code}`,
          text: `Join my game room: ${code}!`,
          url: roomUrl,
        });
        return;
      } catch {}
    }
    setShowInviteModal(true);
  };

  const handleSwitchMode = async (newMode: GameMode) => {
    if (!isHost || newMode === state.gameMode || switchingMode) return;
    setSwitchingMode(true);
    try {
      playClickSound();
      await switchGameMode({ data: { token, mode: newMode } });
    } catch (e) {
      console.error(e);
    } finally {
      setSwitchingMode(false);
    }
  };

  const handleToggleMute = () => {
    const next = toggleMute();
    setMuted(next);
    if (!next) playClickSound();
  };

  return (
    <main className="relative mx-auto w-full max-w-3xl px-4 sm:px-6 py-4 sm:py-8 pb-32 text-white">
      {/* Atmospheric Ambient Glow Orbs */}
      <div className="fixed top-16 left-1/4 w-[500px] h-[350px] bg-primary/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-12 right-1/4 w-[450px] h-[350px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Top Header Bar */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 liquid-glass-card border border-white/15 p-4 rounded-2xl backdrop-blur-xl mb-6 sm:mb-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-3">
          {/* Room Code Badge */}
          <div className="rounded-xl liquid-glass border border-white/15 px-3.5 py-1.5 flex items-center gap-2 shadow-inner">
            <span className="text-[11px] text-gray-400 font-bold tracking-wider uppercase">CODE:</span>
            <span className="font-mono text-lg font-black tracking-widest text-primary drop-shadow-[0_0_8px_var(--color-primary-glow)]">
              {code}
            </span>
            <button
              onClick={copyLink}
              className="ml-1 text-gray-400 hover:text-white transition-colors cursor-pointer p-0.5 rounded hover:bg-white/10"
              title="Copy link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Mode Pill Badge */}
          <span className="liquid-glass-pill rounded-full border border-primary/40 px-3 py-1 text-xs font-black uppercase text-primary flex items-center gap-1.5 shadow-[0_0_12px_var(--color-primary-glow)]">
            <Sparkles className="w-3 h-3 animate-pulse" />
            {state.gameMode === "chameleon" ? "Word Chameleon" : "Odd One Out"}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2 sm:gap-2.5">
          <button
            onClick={() => {
              playClickSound();
              setShowInviteModal(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-primary/40 bg-primary/15 px-3.5 py-2 text-xs font-bold text-primary hover:bg-primary hover:text-white transition-all cursor-pointer shadow-[0_0_12px_var(--color-primary-glow)]"
            title="Invite & QR Code"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Invite & QR</span>
          </button>

          <button
            onClick={handleToggleMute}
            className="p-2 rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title={muted ? "Unmute Audio" : "Mute Audio"}
          >
            {muted ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            )}
          </button>

          <Link
            to="/room/$code/history"
            params={{ code }}
            onClick={() => playClickSound()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <History className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">History</span>
          </Link>

          <button
            onClick={() => {
              playClickSound();
              leaveRoom({ data: { token } }).then(() => onLostSeat());
            }}
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-400 px-2 py-2 rounded-xl hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Leave</span>
          </button>
        </div>
      </header>

      {/* Phase: Lobby */}
      {state.phase === "lobby" && (
        <div className="mt-6 space-y-6 animate-in fade-in duration-300">
          {/* Game Mode Showcase Banner */}
          <div className="liquid-glass-card p-5 sm:p-7 relative overflow-hidden rounded-3xl border border-white/15 shadow-[0_16px_48px_rgba(0,0,0,0.6)]">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none select-none text-8xl">
              {state.gameMode === "chameleon" ? "🦎" : "🕵️"}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="liquid-glass-pill rounded-full px-3.5 py-1 text-[11px] font-black uppercase tracking-widest flex items-center gap-1.5 text-primary border border-primary/40 shadow-[0_0_14px_var(--color-primary-glow)]">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                    </span>
                    {state.gameMode === "chameleon" ? "🦎 Word Chameleon" : "🕵️ Odd One Out"}
                  </span>
                  <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-gray-400 liquid-glass px-2.5 py-0.5 rounded-full border border-white/10">
                    Active Game
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight mt-1">
                  {state.gameMode === "chameleon" ? "Word Chameleon Room" : "Odd One Out Room"}
                </h2>

                <p className="text-xs sm:text-sm text-gray-300 max-w-xl leading-relaxed">
                  {state.gameMode === "chameleon"
                    ? "Everyone shares the exact same secret word except 1 Chameleon who only knows the category! Blend in with subtle clues or expose them."
                    : "One player secretly receives an odd word while everyone else shares the majority word. Ask questions and uncover the imposter!"}
                </p>

                {/* 3-Step Visual Gameplay Guide */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-3 text-center text-[10px] sm:text-xs">
                  <div className="rounded-2xl liquid-glass p-2.5 sm:p-3 border border-white/10 shadow-sm">
                    <span className="text-primary font-black block mb-0.5">1. Secret Clue</span>
                    <span className="text-gray-300">Words assigned</span>
                  </div>
                  <div className="rounded-2xl liquid-glass p-2.5 sm:p-3 border border-white/10 shadow-sm">
                    <span className="text-primary font-black block mb-0.5">2. Clue Giving</span>
                    <span className="text-gray-300">Give 1-word hints</span>
                  </div>
                  <div className="rounded-2xl liquid-glass p-2.5 sm:p-3 border border-white/10 shadow-sm">
                    <span className="text-primary font-black block mb-0.5">3. Deduction</span>
                    <span className="text-gray-300">Vote out imposter</span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex sm:flex-col items-center gap-2">
                <span className="text-xs font-bold text-gray-300 liquid-glass border border-white/15 px-3.5 py-2 rounded-xl text-center shadow-sm">
                  Min 3 Players
                </span>
                <span className="text-[11px] text-gray-500 font-mono">Max 16</span>
              </div>
            </div>
          </div>

          {/* Players Roster & Readiness Status */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span>Players in Room</span>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs font-mono font-bold text-gray-300">
                  {state.players.length}/16
                </span>
              </h2>
              <button
                onClick={() => {
                  playClickSound();
                  setShowInviteModal(true);
                }}
                className="text-xs text-primary hover:text-white font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" /> + Invite Friend
              </button>
            </div>

            {/* Minimum Players Readiness Progress Meter */}
            <div className="rounded-2xl liquid-glass p-3.5 mb-4 shadow-inner border border-white/15">
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className="text-gray-300 flex items-center gap-2">
                  <Radio className="w-3.5 h-3.5 text-primary animate-pulse" />
                  Lobby Readiness Status
                </span>
                {state.players.length >= 3 ? (
                  <span className="text-emerald-400 flex items-center gap-1 font-black">
                    <CheckCircle2 className="w-4 h-4" /> Ready to Launch!
                  </span>
                ) : (
                  <span className="text-amber-400 font-semibold">
                    Need {3 - state.players.length} more player{3 - state.players.length > 1 ? "s" : ""} to unlock start
                  </span>
                )}
              </div>
              <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    state.players.length >= 3
                      ? "bg-gradient-to-r from-primary to-emerald-400 shadow-[0_0_12px_var(--color-primary)]"
                      : "bg-gradient-to-r from-amber-500 to-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                  }`}
                  style={{ width: `${Math.min(100, (state.players.length / 3) * 100)}%` }}
                />
              </div>
            </div>

            {/* Players Grid with Active & Ghost Slots */}
            <ul className="grid gap-3 sm:grid-cols-2">
              {state.players.map((p, idx) => (
                <li
                  key={p.id}
                  className={`flex items-center justify-between rounded-2xl border p-3.5 backdrop-blur-md transition-all ${
                    p.id === state.me.id
                      ? "liquid-glass border-primary/50 bg-primary/10 shadow-[0_0_20px_var(--color-primary-glow)] ring-1 ring-primary/40"
                      : "liquid-glass-card border-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-black text-black shadow-lg relative overflow-hidden"
                      style={{ backgroundColor: getAvatarColor(idx) }}
                    >
                      {getInitials(p.nickname)}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-white flex items-center gap-1.5">
                        {p.nickname}
                        {p.id === state.me.id && (
                          <span className="text-[10px] text-primary font-bold bg-primary/20 px-1.5 py-0.2 rounded border border-primary/30">
                            You
                          </span>
                        )}
                        {p.isHost && (
                          <span className="flex items-center gap-1 text-[10px] text-amber-300 font-bold bg-amber-500/20 px-1.5 py-0.2 rounded border border-amber-500/40">
                            <Crown className="w-3 h-3 text-amber-400" /> Host
                          </span>
                        )}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-400 font-medium">{p.score} points</span>
                        <span className="inline-block w-1 h-1 rounded-full bg-gray-600" />
                        <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Ready
                        </span>
                      </div>
                    </div>
                  </div>

                  {isHost && p.id !== state.me.id && (
                    <button
                      onClick={() => {
                        playClickSound();
                        kickPlayer({ data: { token, targetId: p.id } });
                      }}
                      className="text-xs text-red-400/80 hover:text-red-400 px-2 py-1 rounded hover:bg-red-500/10 transition-colors cursor-pointer"
                    >
                      Kick
                    </button>
                  )}
                </li>
              ))}

              {/* Dynamic Empty Ghost Slots */}
              {state.players.length < 3 && (
                <>
                  <li
                    onClick={() => {
                      playClickSound();
                      setShowInviteModal(true);
                    }}
                    className="flex items-center justify-between rounded-2xl border-2 border-dashed border-white/20 p-3.5 liquid-glass hover:bg-white/[0.06] hover:border-primary/60 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-400 group-hover:text-primary group-hover:border-primary/50 transition-colors">
                        <UserPlus className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-gray-300 group-hover:text-white transition-colors">
                          Waiting for Player {state.players.length + 1}...
                        </p>
                        <p className="text-xs text-primary font-bold flex items-center gap-1 mt-0.5">
                          Tap to Invite Friend <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-mono font-bold text-gray-400 group-hover:text-white border border-white/10 px-2.5 py-1 rounded-lg">
                      Invite
                    </span>
                  </li>

                  {state.players.length < 2 && (
                    <li
                      onClick={() => {
                        playClickSound();
                        setShowInviteModal(true);
                      }}
                      className="flex items-center justify-between rounded-2xl border-2 border-dashed border-white/15 p-3.5 liquid-glass hover:bg-white/[0.05] hover:border-primary/40 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-500 group-hover:text-primary transition-colors">
                          <UserPlus className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-gray-400 group-hover:text-white transition-colors">
                            Waiting for Player 3...
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">Minimum 3 players needed</p>
                        </div>
                      </div>
                      <span className="text-[10px] uppercase font-mono font-bold text-gray-600 border border-white/5 px-2 py-0.5 rounded-md">
                        Slot 3
                      </span>
                    </li>
                  )}
                </>
              )}
            </ul>
          </div>

          {/* Mobile-Friendly Sticky Action Dock with Liquid Glass */}
          <div className="sticky bottom-3 sm:static z-30 pt-2 pb-safe">
            <div className="liquid-glass-card rounded-3xl p-3.5 sm:p-5 border border-white/20 shadow-[0_16px_48px_rgba(0,0,0,0.75)] backdrop-blur-2xl">
              {isHost ? (
                state.players.length < 3 ? (
                  /* Waiting State for Host (< 3 Players) */
                  <div className="space-y-3">
                    {/* Status Pill with live pulse and player counter */}
                    <div className="liquid-glass rounded-2xl px-4 py-3 border border-amber-500/25 bg-amber-500/[0.05] flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="relative flex h-3 w-3 shrink-0">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400" />
                        </span>
                        <div className="truncate">
                          <p className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 truncate">
                            Waiting for {3 - state.players.length} more player{3 - state.players.length > 1 ? "s" : ""}
                          </p>
                          <p className="text-[11px] text-gray-400 truncate">
                            Min 3 required • Room code: <span className="font-mono text-primary font-bold">{code}</span>
                          </p>
                        </div>
                      </div>
                      <span className="liquid-glass-pill px-2.5 py-1 rounded-lg text-xs font-mono font-black text-amber-300 border border-amber-500/30 shrink-0">
                        {state.players.length}/3
                      </span>
                    </div>

                    {/* Primary Mobile-Friendly Invite CTA Button */}
                    <button
                      type="button"
                      onClick={() => {
                        playClickSound();
                        setShowInviteModal(true);
                      }}
                      className="w-full h-11 sm:h-12 rounded-xl sm:rounded-2xl liquid-glass-primary font-black text-white text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition-all shadow-[0_0_24px_var(--color-primary-glow)]"
                    >
                      <UserPlus className="w-4 h-4 text-white" />
                      <span>Invite Friends to Start</span>
                      <ArrowRight className="w-4 h-4 text-white/80" />
                    </button>
                  </div>
                ) : (
                  /* Ready State for Host (>= 3 Players) */
                  <div className="space-y-3">
                    {/* Ready Banner */}
                    <div className="liquid-glass rounded-2xl px-4 py-2.5 border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-xs sm:text-sm font-bold text-emerald-300">
                          Room ready! {state.players.length} players joined.
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-emerald-400/80 font-bold">
                        Ready
                      </span>
                    </div>

                    {/* Launch Round Button */}
                    <Button
                      onClick={async () => {
                        if (isActionPending) return;
                        setIsActionPending(true);
                        try {
                          playClickSound();
                          await startRound({ data: { token } });
                        } finally {
                          setIsActionPending(false);
                        }
                      }}
                      disabled={isActionPending}
                      variant="hero"
                      className="w-full h-11 sm:h-12 rounded-xl sm:rounded-2xl font-black uppercase tracking-widest text-xs sm:text-sm transition-all shadow-[0_0_30px_var(--color-primary-glow)] hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-current mr-1.5" />
                      {isActionPending ? "Starting Round..." : `Start Round ${state.round + 1}`}
                    </Button>
                  </div>
                )
              ) : (
                /* Non-Host State */
                <div className="text-center py-3 space-y-2">
                  <div className="inline-flex items-center justify-center gap-2 text-gray-200 font-bold text-sm">
                    <Clock className="w-4 h-4 text-primary animate-pulse" />
                    <span>Waiting for host to start the round…</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    {state.players.length < 3
                      ? `Room needs at least 3 players (${state.players.length}/3 joined)`
                      : "All set! Host can start at any moment."}
                  </p>
                  {state.players.length < 3 && (
                    <button
                      type="button"
                      onClick={() => {
                        playClickSound();
                        setShowInviteModal(true);
                      }}
                      className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl liquid-glass border border-primary/30 text-primary font-bold text-xs hover:bg-primary/10 transition-all cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" /> Invite More Players
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Interactive Invite Modal with QR Code */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="liquid-glass-card w-full max-w-sm border border-white/20 rounded-3xl p-6 sm:p-7 relative shadow-[0_0_60px_rgba(0,0,0,0.9)] text-center">
            <button
              onClick={() => setShowInviteModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1.5 rounded-full liquid-glass hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl liquid-glass border border-primary/40 flex items-center justify-center mx-auto mb-3 text-primary shadow-[0_0_20px_var(--color-primary-glow)]">
              <QrCode className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-black text-white font-display">Invite Friends</h3>
            <p className="text-xs text-gray-300 mt-1 mb-4">
              Scan with any mobile phone camera or share the direct link.
            </p>

            {/* Room Code Callout */}
            <div className="rounded-2xl liquid-glass border border-white/15 p-3 mb-4">
              <span className="text-[10px] uppercase font-mono tracking-widest text-gray-400 block mb-1 font-bold">
                ROOM PASSCODE
              </span>
              <span className="font-mono text-3xl font-black tracking-widest text-primary drop-shadow-[0_0_12px_var(--color-primary-glow)]">
                {code}
              </span>
            </div>

            {/* Scannable QR Code */}
            <div className="p-3.5 bg-slate-950/80 border border-white/15 rounded-2xl inline-block mx-auto mb-4 shadow-inner">
              <img
                src={qrUrl}
                alt={`QR code to join room ${code}`}
                className="w-44 h-44 rounded-lg object-contain mx-auto"
              />
            </div>

            {/* Direct Action Buttons */}
            <div className="space-y-2.5">
              <button
                onClick={copyLink}
                className="w-full h-12 rounded-2xl liquid-glass-primary font-black text-white text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-[0_0_20px_var(--color-primary-glow)] cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                {copied ? "Link Copied to Clipboard!" : "Copy Invite Link"}
              </button>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Join my Secret Word Room game! 🎮 Room Code: ${code}\n${roomUrl}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full h-11 rounded-2xl liquid-glass border border-white/15 hover:bg-white/10 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                Share via WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

        {/* Phase: Reveal Word */}
        {state.phase === "reveal" && (
          <div className="mt-8 max-w-md mx-auto space-y-6 text-center animate-in fade-in duration-300">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              Round {state.round} · Secret Card
            </p>
            <h1 className="text-3xl font-black uppercase">Check Your Word</h1>
            <p className="text-xs text-gray-400">
              Keep your screen tilted away from other players before revealing.
            </p>

            {/* Interactive Secret Card */}
            <div
              onClick={() => {
                playPeekSound();
                setRevealed(!revealed);
              }}
              className={`panel p-8 cursor-pointer select-none transition-all duration-300 ${
                revealed
                  ? "bg-primary text-white scale-105 shadow-2xl shadow-primary/30"
                  : "text-white hover:border-primary/50"
              }`}
            >
              {revealed ? (
                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-widest opacity-80">
                    {activeIsChameleon ? "You are the Chameleon! 🦎" : "Your Secret Word"}
                  </p>
                  <p className="text-4xl sm:text-5xl font-black tracking-wider">
                    {activeIsChameleon ? "CHAMELEON" : activeDisplayWord}
                  </p>
                  {activeIsChameleon && activeCategoryHint && (
                    <p className="text-sm font-bold mt-2">
                      Category Hint: {activeCategoryHint}
                    </p>
                  )}
                  <p className="text-[10px] font-semibold opacity-70 mt-4">Tap to hide</p>
                </div>
              ) : (
                <div className="py-6 space-y-3">
                  <Eye className="w-10 h-10 mx-auto text-primary animate-pulse" />
                  <p className="text-lg font-bold">Tap to Reveal</p>
                  <p className="text-xs text-gray-500">Hold private</p>
                </div>
              )}
            </div>

            {isHost && (
              <Button
                onClick={async () => {
                  if (isActionPending) return;
                  setIsActionPending(true);
                  try {
                    playClickSound();
                    await beginDiscussion({ data: { token } });
                  } finally {
                    setIsActionPending(false);
                  }
                }}
                disabled={isActionPending}
                variant="hero"
                className="w-full h-11 sm:h-12 rounded-xl sm:rounded-2xl font-black uppercase tracking-wider disabled:opacity-50 text-xs sm:text-sm shadow-[0_0_20px_var(--color-primary-glow)]"
              >
                {isActionPending ? "Starting Discussion..." : <>Begin Discussion <ArrowRight className="w-4 h-4 ml-1" /></>}
              </Button>
            )}
          </div>
        )}

        {/* Phase: Discussion */}
        {state.phase === "discuss" && (
          <div className="mt-8 max-w-lg mx-auto space-y-6 text-center animate-in fade-in duration-300">
            <FloatingEmotes code={code} phase="discuss" />

            <div className="flex flex-col items-center gap-3">
              <PhaseCountdownTimer phaseEndsAt={state.phaseEndsAt} />
            </div>

            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
              Give Your Clues
            </h1>
            <p className="text-sm text-gray-400">
              Take turns giving a one-word or short clue about your secret word. Listen closely for anyone who seems lost!
            </p>

            {/* Secret word reminder button */}
            <div className="inline-block">
              <button
                onClick={() => {
                  playPeekSound();
                  setRevealed(!revealed);
                }}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                {revealed ? `Word: ${activeDisplayWord || (activeIsChameleon ? "CHAMELEON" : "")}` : "Peek at word"}
              </button>
            </div>

            {isHost && (
              <div className="pt-6">
                <Button
                  onClick={async () => {
                    if (isActionPending) return;
                    setIsActionPending(true);
                    try {
                      playClickSound();
                      await startVoting({ data: { token } });
                    } finally {
                      setIsActionPending(false);
                    }
                  }}
                  disabled={isActionPending}
                  variant="hero"
                  className="w-full h-11 sm:h-12 rounded-xl sm:rounded-2xl font-black uppercase tracking-wider shadow-[0_0_20px_var(--color-primary-glow)] disabled:opacity-50 text-xs sm:text-sm"
                >
                  {isActionPending ? "Starting Voting..." : <>Start Voting Phase <ArrowRight className="w-4 h-4 ml-1" /></>}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Phase: Voting */}
        {state.phase === "vote" && (
          <div className="mt-8 max-w-lg mx-auto space-y-6 animate-in fade-in duration-300">
            <FloatingEmotes code={code} phase="vote" />
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-primary">Voting Phase</p>
              <h1 className="text-3xl font-black uppercase mt-1">Vote for the Imposter</h1>
              <p className="text-sm text-gray-400 mt-1">
                Choose the player you believe is holding the odd word.
              </p>
            </div>

            {/* Live Voting Progress Bar */}
            {state.votingProgress && (
              <div className="panel p-4 border-white/10 bg-zinc-900/70">
                <div className="flex justify-between items-center text-xs font-bold mb-2">
                  <span className="text-gray-400 uppercase tracking-wider">Live Vote Progress</span>
                  <span className="text-primary font-black">
                    {state.votingProgress.votedCount} / {state.votingProgress.totalVoters} Voted
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-emerald-400 transition-all duration-500 rounded-full"
                    style={{
                      width: `${(state.votingProgress.votedCount / Math.max(1, state.votingProgress.totalVoters)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {state.players
                .filter((p) => p.id !== state.me.id)
                .map((p, idx) => {
                  const isMyPick = state.me.votedForId === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        playVoteSound();
                        castVote({ data: { token, targetId: p.id } });
                      }}
                      className={`panel p-4 flex items-center justify-between transition-all cursor-pointer text-left ${
                        isMyPick
                          ? "border-primary bg-primary/15 ring-2 ring-primary/50 shadow-lg shadow-primary/20 scale-[1.02]"
                          : "hover:border-primary/60 hover:bg-primary/5"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-black text-black"
                          style={{ backgroundColor: getAvatarColor(idx) }}
                        >
                          {getInitials(p.nickname)}
                        </div>
                        <span className="font-bold text-white text-sm">{p.nickname}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {isMyPick && (
                          <span className="flex items-center gap-1 text-[10px] text-primary font-black uppercase">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Your Vote
                          </span>
                        )}
                        {p.hasVoted && !isMyPick && (
                          <span className="text-[10px] text-emerald-400 font-bold uppercase">
                            Voted
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
            </div>

            {isHost && (
              <div className="pt-4">
                <Button
                  onClick={() => {
                    playClickSound();
                    forceResults({ data: { token } });
                  }}
                  variant="surface"
                  className="w-full text-xs font-bold uppercase tracking-wider"
                >
                  Force Results Now
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Phase: Results */}
        {state.phase === "results" && state.results && (
          <div className="mt-8 max-w-lg mx-auto space-y-6 animate-in fade-in duration-300">
            <div className="text-center">
              <span
                className={`rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-widest ${
                  state.results.minorityCaught
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                }`}
              >
                {state.results.minorityCaught ? "Imposter Caught! 🎉" : "Imposter Got Away! 🕵️"}
              </span>
              <h1 className="text-3xl sm:text-4xl font-black uppercase mt-3">Round Results</h1>
            </div>

            {/* Chameleon Final Guess Mechanic */}
            {state.gameMode === "chameleon" && state.results.minorityCaught && (
              <div className="panel p-6 border-emerald-500/30 bg-emerald-950/20 text-center space-y-4">
                <h3 className="text-lg font-bold text-emerald-400">🦎 Chameleon's Final Guess</h3>
                <p className="text-xs text-gray-300">
                  The Chameleon has been caught, but can steal the victory by guessing the secret word!
                </p>
                {state.me.isChameleon && !guessResult ? (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!guessInput.trim()) return;
                      playClickSound();
                      const res = await guessChameleonWord({ data: { token, guess: guessInput } });
                      setGuessResult(res);
                      if (res.correct) playWinSound();
                      else playDefeatSound();
                    }}
                    className="flex gap-2 max-w-sm mx-auto"
                  >
                    <Input
                      value={guessInput}
                      onChange={(e) => setGuessInput(e.target.value)}
                      placeholder="Guess the secret word..."
                      className="bg-black/50 border-white/20 text-white"
                    />
                    <Button
                      type="submit"
                      className="bg-primary hover:bg-primary-dark text-white font-bold h-10 px-4 rounded-xl text-xs sm:text-sm shadow-md"
                    >
                      Guess
                    </Button>
                  </form>
                ) : guessResult ? (
                  <p className="text-sm font-bold text-emerald-400">
                    {guessResult.correct
                      ? "🎉 Correct guess! The Chameleon stole the win!"
                      : `Incorrect. The word was ${guessResult.word}.`}
                  </p>
                ) : null}
              </div>
            )}

            {/* Words reveal cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="panel p-4 text-center">
                <p className="text-[10px] uppercase font-bold text-gray-400">Majority Word</p>
                <p className="text-xl font-black text-white mt-1">{state.results.majorWord}</p>
              </div>
              <div className="panel p-4 border-primary/30 bg-primary/10 text-center">
                <p className="text-[10px] uppercase font-bold text-primary">Odd Word</p>
                <p className="text-xl font-black text-primary mt-1">{state.results.minorWord}</p>
              </div>
            </div>

            {/* Vote breakdown */}
            <div className="panel p-5">
              <h3 className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-3">
                Vote Breakdown
              </h3>
              <div className="space-y-2">
                {state.results.tally.map((item) => {
                  const player = state.players.find((p) => p.id === item.playerId);
                  return (
                    <div key={item.playerId} className="flex items-center justify-between text-sm">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        {player?.nickname}
                        {item.playerId === state.results?.minorityPlayerId && " 🕵️"}
                      </span>
                      <span className="text-primary font-black">{item.votes} votes</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {isHost && (
              <div className="pt-4">
                <Button
                  onClick={async () => {
                    if (isActionPending) return;
                    setIsActionPending(true);
                    try {
                      playClickSound();
                      await nextRound({ data: { token } });
                    } finally {
                      setIsActionPending(false);
                    }
                  }}
                  disabled={isActionPending}
                  variant="hero"
                  className="w-full h-11 sm:h-12 rounded-xl sm:rounded-2xl font-black uppercase tracking-wider shadow-[0_0_20px_var(--color-primary-glow)] disabled:opacity-50 text-xs sm:text-sm"
                >
                  <RotateCcw className={`w-4 h-4 mr-2 ${isActionPending ? "animate-spin" : ""}`} />{" "}
                  {isActionPending ? "Starting Next Round..." : "Next Round"}
                </Button>
              </div>
            )}
          </div>
        )}
    </main>
  );
}

// Full Mafia Implementation
function MafiaGame({
  state,
  token,
  onLeave,
}: {
  state: GameState;
  token: string;
  onLeave: () => void;
}) {
  const startGame = useServerFn(mafiaStartGameFn);
  const nightAction = useServerFn(mafiaNightActionFn);
  const beginMorning = useServerFn(mafiaBeginMorningFn);
  const beginDiscuss = useServerFn(mafiaBeginDiscussFn);
  const beginVote = useServerFn(mafiaBeginVoteFn);
  const castVote = useServerFn(mafiaCastVoteFn);
  const forceVoteResults = useServerFn(mafiaForceVoteResultsFn);
  const nextNight = useServerFn(mafiaNextNightFn);
  const restartGame = useServerFn(mafiaRestartGameFn);
  const kickPlayer = useServerFn(kickPlayerFn);

  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [actionDone, setActionDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const [muted, setMuted] = useState(() => getIsMuted());

  const prevPhaseRef = useRef<string | null>(null);

  const isHost = state.me.isHost;
  const myRole = state.me.mafiaRole;
  const isDead = state.players.find((p) => p.id === state.me.id)?.isDead ?? false;

  useEffect(() => {
    if (!state) return;
    if (prevPhaseRef.current !== state.phase) {
      if (state.phase === "mafia_morning") {
        const victim = state.players.find((p) => p.id === state.mafia?.lastKilled);
        if (victim) playDefeatSound();
        else playWinSound();
      } else if (state.phase === "mafia_game_over") {
        const winner = state.mafia?.winner;
        const myTeamWon =
          (myRole === "MAFIA" && winner === "MAFIA") || (myRole !== "MAFIA" && winner === "TOWN");
        if (myTeamWon) playWinSound();
        else playDefeatSound();
      }
    }
    prevPhaseRef.current = state.phase;
  }, [state.phase, state.players, state.mafia, myRole]);

  const copyLink = () => {
    playClickSound();
    navigator.clipboard.writeText(`${window.location.origin}/room/${state.code}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    playClickSound();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Mafia — Room ${state.code}`,
          text: `Join our Mafia game room: ${state.code}!`,
          url: `${window.location.origin}/room/${state.code}`,
        });
        return;
      } catch {}
    }
    copyLink();
  };

  const handleToggleMute = () => {
    const next = toggleMute();
    setMuted(next);
    if (!next) playClickSound();
  };

  // Shared Mafia Top Header
  const renderMafiaHeader = () => (
    <header className="w-full max-w-3xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-card/40 border border-border/60 p-4 rounded-2xl backdrop-blur-md mb-6 sm:mb-8">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-white/5 border border-white/10 px-3.5 py-1.5 flex items-center gap-2">
          <span className="text-xs text-gray-400 font-bold">CODE:</span>
          <span className="font-mono text-lg font-black tracking-widest text-[var(--mafia-red)]">
            {state.code}
          </span>
          <button
            onClick={copyLink}
            className="ml-1 text-gray-400 hover:text-white transition-colors cursor-pointer"
            title="Copy link"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        <span className="rounded-full bg-red-500/20 border border-red-500/30 px-3 py-1 text-xs font-black uppercase text-red-400 flex items-center gap-1.5">
          <Lock className="w-3 h-3" />
          Mafia
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-gray-300 hover:text-white transition-colors cursor-pointer"
          title="Share Room Invite"
        >
          <Share2 className="w-3.5 h-3.5 text-red-400" />
          <span className="hidden sm:inline">Invite</span>
        </button>

        <button
          onClick={handleToggleMute}
          className="p-2 rounded-lg border border-white/10 bg-white/5 text-gray-300 hover:text-white transition-colors cursor-pointer"
          title={muted ? "Unmute Audio" : "Mute Audio"}
        >
          {muted ? (
            <VolumeX className="w-4 h-4 text-red-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-emerald-400" />
          )}
        </button>

        <Link
          to="/room/$code/history"
          params={{ code: state.code }}
          onClick={() => playClickSound()}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-gray-300 hover:text-white transition-colors"
        >
          <History className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">History</span>
        </Link>
        <button
          onClick={() => {
            playClickSound();
            onLeave();
          }}
          className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" /> Leave
        </button>
      </div>
    </header>
  );

  // Mafia Lobby
  if (state.phase === "lobby") {
    return (
      <main className="mafia-bg-night min-h-screen pt-6 pb-12 px-4 text-white">
        {renderMafiaHeader()}
        <div className="w-full max-w-md mx-auto space-y-6 text-center animate-mafia-up">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--mafia-red)]">
            Social Deduction
          </p>
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-[var(--mafia-red)]">
            MAFIA
          </h1>

          {/* Locked Game Mode Card */}
          <div className="panel p-4 border-red-500/20 bg-red-950/20 text-left">
            <div className="flex items-center gap-2 mb-1">
              <Lock className="w-3.5 h-3.5 text-red-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                Locked Game Mode
              </span>
            </div>
            <p className="text-xs text-gray-300">
              Mafia assigns secret roles (Mafia, Doctor, Police, Civilians). Roles and settings cannot be changed to prevent cheating.
            </p>
          </div>

          <div className="mafia-panel p-6 text-center space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-gray-400">Players</span>
              <span className="text-xs font-bold text-red-400">
                {state.players.length} / 16 (Min 4)
              </span>
            </div>
            <div className="space-y-2 text-left">
              {state.players.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-white/5 bg-white/5 text-sm font-bold text-gray-200"
                >
                  <div className="flex items-center gap-2">
                    <span>{p.nickname}</span>
                    {p.id === state.me.id && <span className="text-[10px] text-red-400">(You)</span>}
                    {p.isHost && <Crown className="w-3.5 h-3.5 text-amber-400" />}
                  </div>
                  {isHost && p.id !== state.me.id && (
                    <button
                      onClick={() => {
                        playClickSound();
                        kickPlayer({ data: { token, targetId: p.id } });
                      }}
                      className="text-xs text-red-400/80 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      Kick
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {isHost ? (
            <button
              onClick={() => {
                playClickSound();
                startGame({ data: { token } });
              }}
              disabled={state.players.length < 4}
              className="mafia-btn mafia-btn-red w-full"
            >
              Start Mafia Game
            </button>
          ) : (
            <p className="text-xs text-gray-500">Waiting for host to start…</p>
          )}
          {state.players.length < 4 && (
            <p className="text-xs text-gray-500">
              Need {4 - state.players.length} more player(s) to begin Mafia.
            </p>
          )}
        </div>
      </main>
    );
  }

  // Role Reveal Phase
  if (state.phase === "mafia_reveal") {
    return (
      <main className="mafia-bg-night min-h-screen pt-6 pb-12 px-4 text-white">
        {renderMafiaHeader()}
        <div className="w-full max-w-md mx-auto space-y-6 text-center animate-mafia-scale">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-gray-400">
            Your Secret Role
          </p>
          <div className="mafia-panel p-8 space-y-4">
            <span className="text-6xl animate-bounce">
              {myRole === "MAFIA" ? "🩸" : myRole === "DOCTOR" ? "💚" : myRole === "POLICE" ? "🔎" : "🏘️"}
            </span>
            <h1 className="text-4xl font-black text-white">{myRole}</h1>
            <p className="text-sm text-gray-400">
              {myRole === "MAFIA"
                ? "Eliminate the town each night. Coordinate with your team."
                : myRole === "DOCTOR"
                  ? "Protect one player every night from attacks."
                  : myRole === "POLICE"
                    ? "Investigate one player each night to uncover their true allegiance."
                    : "You are an honest civilian. Use your wits to root out the Mafia."}
            </p>

            {myRole === "MAFIA" && state.me.mafiaTeammates && state.me.mafiaTeammates.length > 1 && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 font-bold">
                Fellow Mafia:{" "}
                {state.players
                  .filter((p) => state.me.mafiaTeammates?.includes(p.id) && p.id !== state.me.id)
                  .map((p) => p.nickname)
                  .join(", ")}
              </div>
            )}
          </div>
          {isHost && (
            <button
              onClick={() => {
                playClickSound();
                nextNight({ data: { token } });
              }}
              className="mafia-btn mafia-btn-red w-full"
            >
              Begin Night Phase
            </button>
          )}
        </div>
      </main>
    );
  }

  // Night Phase
  if (state.phase === "mafia_night") {
    return (
      <main className="mafia-bg-night min-h-screen pt-6 pb-12 px-4 text-white">
        {renderMafiaHeader()}
        <div className="w-full max-w-md mx-auto space-y-6 text-center animate-mafia-up">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--mafia-red)]">
            Night Phase · Round {state.round}
          </p>
          <h1 className="text-3xl font-black">The Town is Asleep</h1>

          {isDead ? (
            <div className="mafia-panel p-6">
              <p className="text-gray-400 text-sm">You are dead. Spectate in silence.</p>
            </div>
          ) : myRole === "CIVILIAN" ? (
            <div className="mafia-panel p-8 space-y-3">
              <p className="text-4xl">😴</p>
              <p className="text-sm font-bold text-gray-300">You are sleeping peacefully.</p>
              <p className="text-xs text-gray-500">Wait for the morning to discover what occurred.</p>
            </div>
          ) : (
            <div className="mafia-panel p-6 space-y-4">
              <p className="text-sm font-bold text-white">
                {myRole === "MAFIA"
                  ? "Select a target to eliminate:"
                  : myRole === "DOCTOR"
                    ? "Select a player to protect:"
                    : "Select a suspect to investigate:"}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {state.players
                  .filter((p) => !p.isDead && (myRole !== "MAFIA" || p.id !== state.me.id))
                  .map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        playClickSound();
                        setSelectedTarget(p.id);
                      }}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        selectedTarget === p.id
                          ? myRole === "DOCTOR"
                            ? "mafia-card-green ring-2 ring-emerald-500"
                            : myRole === "POLICE"
                              ? "mafia-card-blue ring-2 ring-blue-500"
                              : "mafia-card-selected ring-2 ring-red-500"
                          : "mafia-card"
                      }`}
                    >
                      {p.nickname}
                    </button>
                  ))}
              </div>
              <button
                onClick={async () => {
                  if (!selectedTarget) return;
                  playVoteSound();
                  await nightAction({ data: { token, targetId: selectedTarget } });
                  setActionDone(true);
                }}
                disabled={!selectedTarget || actionDone}
                className="mafia-btn mafia-btn-red w-full text-xs"
              >
                {actionDone ? "Action Locked In" : "Confirm Night Action"}
              </button>
              {state.me.policeResult && (
                <p className="text-sm font-black text-[var(--mafia-blue)]">
                  Investigation Result: {state.me.policeResult}
                </p>
              )}
            </div>
          )}

          {isHost && (
            <button
              onClick={() => {
                playClickSound();
                beginMorning({ data: { token } });
              }}
              className="mafia-btn mafia-btn-ghost w-full"
            >
              Advance to Morning
            </button>
          )}
        </div>
      </main>
    );
  }

  // Morning Phase
  if (state.phase === "mafia_morning") {
    const victim = state.players.find((p) => p.id === state.mafia?.lastKilled);
    const wasSaved = state.mafia?.wasSaved;

    return (
      <main className="mafia-bg-morning min-h-screen pt-6 pb-12 px-4 text-white">
        {renderMafiaHeader()}
        <div className="w-full max-w-md mx-auto space-y-6 text-center animate-mafia-up">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-amber-400">
            Morning Breaks
          </p>
          <div className="mafia-panel p-8 space-y-4">
            {victim ? (
              <>
                <Skull className="w-12 h-12 mx-auto text-red-500 animate-bounce" />
                <h2 className="text-2xl font-black text-white">{victim.nickname} was eliminated!</h2>
                <p className="text-xs text-gray-400">They were taken during the night.</p>
              </>
            ) : (
              <>
                <Shield className="w-12 h-12 mx-auto text-emerald-400 animate-pulse" />
                <h2 className="text-2xl font-black text-white">Peaceful Night!</h2>
                <p className="text-xs text-gray-400">
                  {wasSaved
                    ? "The Doctor heroically protected the Mafia's target!"
                    : "No one was harmed during the night."}
                </p>
              </>
            )}
          </div>
          {isHost && (
            <button
              onClick={() => {
                playClickSound();
                beginDiscuss({ data: { token } });
              }}
              className="mafia-btn mafia-btn-red w-full"
            >
              Start Town Discussion
            </button>
          )}
        </div>
      </main>
    );
  }

  // Discussion Phase
  if (state.phase === "mafia_discuss") {
    return (
      <main className="mafia-bg-discuss min-h-screen pt-6 pb-12 px-4 text-white">
        {renderMafiaHeader()}
        <FloatingEmotes code={state.code} phase="mafia_discuss" />
        <div className="w-full max-w-md mx-auto space-y-6 text-center animate-mafia-up">
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-primary">Day Phase</p>
            <PhaseCountdownTimer phaseEndsAt={state.phaseEndsAt} />
          </div>
          <h1 className="text-3xl font-black">Town Discussion</h1>
          <p className="text-sm text-gray-400">
            Debate who you find suspicious. Uncover the Mafia before night falls again!
          </p>
          <div className="mafia-panel p-5 text-left space-y-2">
            <p className="text-xs font-bold uppercase text-gray-400 mb-2">Living Players:</p>
            {state.players
              .filter((p) => !p.isDead)
              .map((p) => (
                <div key={p.id} className="text-sm text-gray-200">
                  • {p.nickname} {p.id === state.me.id && "(You)"}
                </div>
              ))}
          </div>
          {isHost && (
            <button
              onClick={() => {
                playClickSound();
                beginVote({ data: { token } });
              }}
              className="mafia-btn mafia-btn-red w-full"
            >
              Call for Town Vote
            </button>
          )}
        </div>
      </main>
    );
  }

  // Voting Phase
  if (state.phase === "mafia_vote") {
    return (
      <main className="mafia-bg-vote min-h-screen pt-6 pb-12 px-4 text-white">
        {renderMafiaHeader()}
        <FloatingEmotes code={state.code} phase="mafia_vote" />
        <div className="w-full max-w-md mx-auto space-y-6 text-center animate-mafia-up">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-red-400">Town Trial</p>
          <h1 className="text-3xl font-black">Vote to Eliminate</h1>

          {/* Live Voting Progress */}
          {state.votingProgress && (
            <div className="mafia-panel p-4">
              <div className="flex justify-between items-center text-xs font-bold mb-2">
                <span className="text-gray-400 uppercase tracking-wider">Tally Progress</span>
                <span className="text-red-400 font-black">
                  {state.votingProgress.votedCount} / {state.votingProgress.totalVoters} Cast
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-600 to-amber-500 transition-all duration-500 rounded-full"
                  style={{
                    width: `${(state.votingProgress.votedCount / Math.max(1, state.votingProgress.totalVoters)) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}

          {!isDead ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {state.players
                  .filter((p) => !p.isDead && p.id !== state.me.id)
                  .map((p) => {
                    const isMyPick = state.me.votedForId === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          playVoteSound();
                          castVote({ data: { token, targetId: p.id } });
                        }}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          isMyPick
                            ? "bg-red-500/20 border-red-500 text-white ring-2 ring-red-500"
                            : "mafia-card hover:border-red-500"
                        }`}
                      >
                        {p.nickname}
                        {isMyPick && <span className="block text-[10px] text-red-400 mt-1">✓ Your Vote</span>}
                      </button>
                    );
                  })}
              </div>

              {/* Abstain / Skip Vote Option */}
              <button
                onClick={() => {
                  playVoteSound();
                  castVote({ data: { token, targetId: "skip" } });
                }}
                className={`w-full p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  state.me.votedForId === "skip"
                    ? "bg-amber-500/20 border-amber-500 text-amber-300 ring-2 ring-amber-500"
                    : "border-white/10 bg-white/5 text-gray-400 hover:text-white"
                }`}
              >
                ⚖️ Abstain / Skip Execution
                {state.me.votedForId === "skip" && (
                  <span className="block text-[10px] text-amber-400 mt-0.5">✓ Abstaining</span>
                )}
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Dead players cannot vote.</p>
          )}

          {isHost && (
            <button
              onClick={() => {
                playClickSound();
                forceVoteResults({ data: { token } });
              }}
              className="mafia-btn mafia-btn-ghost w-full text-xs"
            >
              Tally Votes
            </button>
          )}
        </div>
      </main>
    );
  }

  // Results or Game Over
  if (state.phase === "mafia_results" || state.phase === "mafia_game_over") {
    const isGameOver = state.phase === "mafia_game_over";
    const winner = state.mafia?.winner;
    const condemned = state.mafia?.condemned;

    return (
      <main className="mafia-bg-gameover min-h-screen pt-6 pb-12 px-4 text-white">
        {renderMafiaHeader()}
        <div className="w-full max-w-md mx-auto space-y-6 text-center animate-mafia-scale">
          {isGameOver ? (
            <>
              <p className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--mafia-gold)]">
                Game Over
              </p>
              <h1 className="text-4xl font-black text-white">
                {winner === "TOWN" ? "🎉 The Town Wins!" : "🩸 The Mafia Wins!"}
              </h1>
              {state.mafia?.finalRoles && (
                <div className="mafia-panel p-5 text-left space-y-2">
                  <p className="text-xs font-bold uppercase text-gray-400 mb-2">Final Player Roles:</p>
                  {state.players.map((p) => (
                    <div key={p.id} className="flex justify-between text-xs py-1 border-b border-white/5">
                      <span className="flex items-center gap-1.5 font-medium">
                        {p.nickname}
                        {p.isDead && <Skull className="w-3 h-3 text-red-400" />}
                      </span>
                      <span className="font-bold text-primary">{state.mafia?.finalRoles?.[p.id]}</span>
                    </div>
                  ))}
                </div>
              )}
              {isHost && (
                <button
                  onClick={() => {
                    playClickSound();
                    restartGame({ data: { token } });
                  }}
                  className="mafia-btn mafia-btn-gold w-full"
                >
                  Play Again
                </button>
              )}
            </>
          ) : (
            <>
              <h1 className="text-3xl font-black">Voting Result</h1>
              <div className="mafia-panel p-6 space-y-3 text-center">
                {condemned ? (
                  <>
                    <Skull className="w-10 h-10 text-red-500 mx-auto animate-bounce" />
                    <h3 className="text-xl font-black text-white">
                      {condemned.nickname} was executed!
                    </h3>
                    <p className="text-sm font-bold text-red-400">
                      Their true role was: {condemned.role}
                    </p>
                  </>
                ) : (
                  <>
                    <Shield className="w-10 h-10 text-amber-400 mx-auto" />
                    <h3 className="text-lg font-bold text-white">No One Executed</h3>
                    <p className="text-xs text-gray-400">
                      The Town abstained or tied in the vote. No suspect was condemned today.
                    </p>
                  </>
                )}
              </div>
              {isHost && (
                <button
                  onClick={() => {
                    playClickSound();
                    nextNight({ data: { token } });
                  }}
                  className="mafia-btn mafia-btn-red w-full"
                >
                  Begin Next Night
                </button>
              )}
            </>
          )}
        </div>
      </main>
    );
  }

  return null;
}
