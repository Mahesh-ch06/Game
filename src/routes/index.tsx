import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Play,
  ArrowRight,
  ShieldCheck,
  Lock,
  Users,
  BookOpen,
  HelpCircle,
  Lightbulb,
  Target,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { games } from "@/lib/games";
import { GameCard } from "@/components/GameCard";
import { FeaturedGamesCarousel } from "@/components/FeaturedGamesCarousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SECRET WORD ROOM | Free Multiplayer Social Deduction Games" },
      {
        name: "description",
        content:
          "Play Odd One Out, Word Chameleon, and social deduction party games with friends on any phone, tablet, or PC. Zero downloads, instant room codes, 5,000+ curated word pairs, and fair imposter distribution.",
      },
      {
        name: "keywords",
        content:
          "secret word room, party game, social deduction, odd one out, chameleon game, word games, bluffing game, multiplayer games for friends, zoom party games, classroom games",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Secret Word Room",
          "url": "https://secret-word-room.vercel.app",
          "applicationCategory": "GameApplication",
          "genre": "Social Deduction Party Game",
          "browserRequirements": "Requires JavaScript. Requires HTML5.",
          "operatingSystem": "All modern browsers (iOS, Android, Windows, macOS, Linux)",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
          },
          "description":
            "Multiplayer social deduction party games. Play Odd One Out, Word Chameleon, and more with zero installs and instant room codes.",
        }),
      },
    ],
  }),
  component: HomePage,
});

const fadeUp: any = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer: any = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

function HomePage() {
  const navigate = useNavigate();
  const [quickCode, setQuickCode] = useState("");

  const handleQuickJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickCode.trim()) return;
    navigate({ to: "/room/$code", params: { code: quickCode.trim().toUpperCase() } });
  };
  return (
    <main className="min-h-screen bg-black overflow-hidden font-sans text-white">
      {/* Hero Section */}
      <section className="relative h-[100svh] min-h-[600px] w-full flex items-center justify-center bg-black overflow-hidden">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/20 blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-purple-600/15 blur-[150px]" />
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30" />
        </motion.div>

        <div className="relative z-10 w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 sm:py-12 flex flex-col items-center text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col items-center"
          >
            <motion.span
              variants={fadeUp}
              className="rounded-full border border-white/20 bg-white/5 backdrop-blur-md px-3.5 py-1.5 text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase text-gray-300 mb-6 sm:mb-8"
            >
              Multiplayer Social Games
            </motion.span>
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-7xl md:text-8xl lg:text-[110px] font-black tracking-tighter leading-[0.9] sm:leading-[0.85] uppercase mb-6 sm:mb-8"
            >
              Play.
              <br />
              Deceive.
              <br />
              Deduce.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
                Win.
              </span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="max-w-2xl text-base sm:text-lg md:text-xl text-gray-400 font-medium leading-relaxed mb-8 sm:mb-12 px-2"
            >
              The premier platform for social deduction and party games. Gather your friends, share a
              code, and start playing instantly on any device.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                to="/games"
                className="flex items-center justify-center gap-2 rounded-none bg-primary px-8 sm:px-10 py-4 sm:py-5 text-xs sm:text-sm font-black uppercase tracking-widest text-black transition-transform hover:scale-105"
              >
                Play Now <Play className="w-4 h-4 fill-current" />
              </Link>
              <Link
                to="/games"
                className="flex items-center justify-center gap-2 rounded-none border border-white/20 bg-white/5 backdrop-blur-md px-8 sm:px-10 py-4 sm:py-5 text-xs sm:text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-white/10"
              >
                Explore Games
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-widest text-gray-500">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-gray-500 to-transparent" />
        </motion.div>
      </section>

      {/* Quick Start Room Panel */}
      <section className="relative z-20 -mt-8 mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="bg-zinc-900 border border-white/10 p-5 sm:p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 relative overflow-hidden rounded-xl sm:rounded-none"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-50" />
          <div className="relative z-10">
            <h2 className="text-xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight mb-1 sm:mb-2">
              Got a group? Start a room.
            </h2>
            <p className="text-gray-400 font-medium text-sm sm:text-base">
              Create a room → Share the code → Everyone joins → Start playing.
            </p>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
            <form onSubmit={handleQuickJoin} className="flex gap-2">
              <input
                type="text"
                value={quickCode}
                onChange={(e) => setQuickCode(e.target.value.toUpperCase())}
                placeholder="ROOM CODE"
                maxLength={6}
                className="code-chip px-4 py-3 bg-black/60 border border-white/20 text-primary placeholder:text-gray-500 font-mono text-center sm:text-left text-sm font-black tracking-widest uppercase rounded-lg sm:rounded-none focus:outline-none focus:border-primary w-36 sm:w-40"
              />
              <button
                type="submit"
                disabled={!quickCode.trim()}
                className="flex items-center justify-center gap-1.5 bg-primary text-black px-5 py-3 font-black uppercase tracking-widest text-xs hover:bg-white transition-colors disabled:opacity-40 rounded-lg sm:rounded-none cursor-pointer"
              >
                Join <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
            <Link
              to="/games"
              className="flex items-center justify-center gap-2 border border-white/20 bg-white/5 px-6 py-3 font-black uppercase tracking-widest text-xs text-white hover:bg-white/10 transition-colors rounded-lg sm:rounded-none"
            >
              Browse Games
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Featured Games Carousel */}
      <FeaturedGamesCarousel />

      {/* Discover Your Next Game (Game Cards Grid) */}
      <section className="py-16 sm:py-24 lg:py-32 bg-zinc-950 border-y border-white/5">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-8 sm:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6"
          >
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tighter">
                Discover Your Next Game
              </h2>
              <p className="text-gray-400 mt-2 sm:mt-4 text-sm sm:text-lg">
                A growing library of premium social games.
              </p>
            </div>
            <Link
              to="/games"
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors"
            >
              View All Games <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {games.map((g) => (
              <GameCard key={g.id} game={g} />
            ))}
          </div>
        </div>
      </section>

      {/* Play Your Way Categories */}
      <section id="categories" className="py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-8 sm:mb-16 text-center"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tighter">
              Play Your Way
            </h2>
          </motion.div>
          <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
            {[
              "Social Deduction",
              "Party",
              "Word Games",
              "Strategy",
              "Casual",
              "Mystery",
            ].map((cat, idx) => (
              <motion.div
                key={cat}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative aspect-square bg-zinc-900 border border-white/10 flex items-center justify-center p-3 sm:p-6 text-center hover:bg-white hover:text-black transition-colors duration-300 cursor-pointer rounded-lg sm:rounded-none"
              >
                <span className="font-black uppercase tracking-wider text-[10px] sm:text-sm">
                  {cat}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Multiplayer Experience (How it works) */}
      <section id="how-it-works" className="py-16 sm:py-24 lg:py-32 bg-zinc-950">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-20">
            <div className="lg:sticky lg:top-32 h-fit">
              <h2 className="text-3xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 sm:mb-6 leading-none">
                The Multiplayer
                <br />
                Experience
              </h2>
              <p className="text-base sm:text-xl text-gray-400">
                Play together in the same room or across the globe. No app downloads required.
              </p>
            </div>
            <div className="space-y-8 sm:space-y-12">
              {[
                {
                  step: "01",
                  title: "Create A Room",
                  desc: "Start a private game room and set the rules.",
                },
                {
                  step: "02",
                  title: "Invite Your Friends",
                  desc: "Share the 5-letter room code. Anyone can join instantly.",
                },
                {
                  step: "03",
                  title: "Get Your Secret",
                  desc: "Everyone receives their hidden role or secret word on their own device.",
                },
                {
                  step: "04",
                  title: "Bluff & Discuss",
                  desc: "Talk, deceive, investigate, and survive the timer.",
                },
                {
                  step: "05",
                  title: "Vote",
                  desc: "Lock in your vote for the most suspicious player.",
                },
                {
                  step: "06",
                  title: "Reveal",
                  desc: "Discover who was telling the truth and who was lying.",
                },
              ].map((item) => (
                <motion.div
                  key={item.step}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={fadeUp}
                  className="flex gap-4 sm:gap-6 items-start"
                >
                  <span className="text-2xl sm:text-4xl font-black text-primary/40 shrink-0 mt-1">
                    {item.step}
                  </span>
                  <div>
                    <h3 className="text-lg sm:text-2xl font-black uppercase tracking-wide mb-1 sm:mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-sm sm:text-lg">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Visual Game Mechanics Breakdown */}
      <section className="py-16 sm:py-24 lg:py-32 overflow-hidden">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-32">
          {/* Odd One Out Mechanics */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="flex flex-col items-center text-center"
          >
            <h2 className="text-xl sm:text-3xl font-black uppercase tracking-widest text-gray-500 mb-6 sm:mb-12">
              Odd One Out Mechanics
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-12 w-full max-w-4xl">
              <div className="flex-1 bg-white/5 border border-white/10 p-8 w-full">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 block">
                  Normal Players
                </span>
                <div className="space-y-3">
                  {["APPLE", "APPLE", "APPLE"].map((word, idx) => (
                    <div key={idx} className="bg-zinc-800 py-3 font-black text-xl tracking-widest">
                      {word}
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-4xl font-black text-primary shrink-0">VS</div>
              <div className="flex-1 bg-primary/10 border border-primary/30 p-8 w-full shadow-[0_0_50px_-15px_var(--tw-colors-primary)]">
                <span className="text-xs font-bold text-primary uppercase tracking-widest mb-6 block">
                  The Imposter
                </span>
                <div className="bg-primary text-black py-10 font-black text-3xl tracking-widest scale-110 shadow-2xl">
                  BANANA
                </div>
              </div>
            </div>
          </motion.div>

          {/* Word Chameleon Mechanics */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="flex flex-col items-center text-center"
          >
            <h2 className="text-xl sm:text-3xl font-black uppercase tracking-widest text-gray-500 mb-6 sm:mb-12">
              Word Chameleon Mechanics
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-12 w-full max-w-4xl mb-12">
              <div className="flex-1 bg-white/5 border border-white/10 p-8 w-full">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 block">
                  Normal Players
                </span>
                <div className="space-y-3">
                  {["SPIDER-MAN", "SPIDER-MAN"].map((word, idx) => (
                    <div key={idx} className="bg-zinc-800 py-3 font-black text-xl tracking-widest">
                      {word}
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-4xl font-black text-emerald-500 shrink-0">VS</div>
              <div className="flex-1 bg-emerald-500/10 border border-emerald-500/30 p-8 w-full shadow-[0_0_50px_-15px_#10b981]">
                <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-6 block">
                  The Chameleon
                </span>
                <div className="bg-emerald-500 text-black py-10 font-black text-xl tracking-widest scale-110 shadow-2xl">
                  Category: TOYS & CARTOONS
                </div>
              </div>
            </div>
            <div className="max-w-2xl text-center">
              <h3 className="text-3xl font-black uppercase mb-4">
                Caught? <span className="text-gray-500">Not necessarily.</span>
              </h3>
              <p className="text-xl text-gray-400">
                Guess the secret word at the end and{" "}
                <strong className="text-emerald-500">steal the win.</strong>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Room is Getting Bigger */}
      <section className="py-16 sm:py-24 lg:py-32 bg-zinc-950 border-y border-white/5">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-3xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter mb-3 sm:mb-4">
              The Room is Getting Bigger.
            </h2>
            <p className="text-base sm:text-xl text-gray-400 mb-8 sm:mb-16">
              More premium games are actively in development.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[1, 2, 3].map((num) => (
                <div
                  key={num}
                  className="aspect-[3/4] bg-zinc-900 border border-white/5 flex flex-col items-center justify-center relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50" />
                  <span className="text-6xl font-black text-white/5 group-hover:text-white/10 transition-colors">
                    ?
                  </span>
                  <div className="absolute bottom-6 left-0 right-0 text-center">
                    <span className="text-xs font-bold tracking-widest uppercase text-gray-500">
                      Coming Soon
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Security & Server Guarantee */}
      <section className="py-16 sm:py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-3xl"
          >
            <motion.div variants={fadeUp} className="flex justify-center mb-6 sm:mb-8 gap-3 sm:gap-4">
              <ShieldCheck className="w-8 h-8 sm:w-12 sm:h-12 text-primary" />
              <Lock className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
              <Users className="w-8 h-8 sm:w-12 sm:h-12 text-primary" />
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="text-2xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 sm:mb-6"
            >
              Built for Friends.
              <br />
              Protected by Server.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-base sm:text-xl text-gray-400 mb-8 sm:mb-12 leading-relaxed px-2"
            >
              Every secret role and hidden word is strictly protected. Our server-side game state
              ensures that no one can cheat by inspecting the browser. The only way to win is through
              pure deduction and deception.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 sm:py-32 lg:py-40 bg-zinc-950 text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-4xl sm:text-6xl md:text-[100px] font-black uppercase tracking-tighter leading-none mb-8 sm:mb-12"
          >
            Who's Lying?
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6"
          >
            <Link
              to="/games"
              className="bg-primary text-black px-8 sm:px-12 py-4 sm:py-6 font-black uppercase tracking-widest text-sm sm:text-lg hover:bg-white transition-colors shadow-[0_0_40px_-10px_var(--tw-colors-primary)]"
            >
              Create A Room
            </Link>
            <Link
              to="/games"
              className="border border-white/20 px-8 sm:px-12 py-4 sm:py-6 font-black uppercase tracking-widest text-sm sm:text-lg hover:bg-white/10 transition-colors"
            >
              Explore Games
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Game Strategy Manual & Tactical Rules */}
      <section id="guides" className="py-16 sm:py-24 lg:py-32 bg-zinc-950 border-t border-white/5">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-3">
              <BookOpen className="w-3.5 h-3.5" /> Strategy & Rulebook
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-4">
              Master the Art of Social Deduction
            </h2>
            <p className="text-gray-400 text-sm sm:text-lg">
              Winning in Secret Word Room requires psychological perception, verbal misdirection, and calculated questions.
              Explore our official tactical manual for both Imposters and Detectives.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Odd One Out Strategy Card */}
            <div className="rounded-3xl bg-black/60 border border-white/10 p-6 sm:p-10 relative overflow-hidden backdrop-blur-xl">
              <div className="flex items-center justify-between gap-2 mb-6">
                <span className="rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 px-3 py-1 text-xs font-black uppercase tracking-wider">
                  Odd One Out Manual
                </span>
                <span className="text-xs font-mono text-gray-400">3–16 Players</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black uppercase text-white mb-4">
                The Imposter vs The Group
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed mb-6">
                In Odd One Out, every player is given the exact same secret word (e.g. &ldquo;Astronaut&rdquo;), except for one
                randomly selected player who receives a closely related impostor word (e.g. &ldquo;Alien&rdquo;). Players take turns
                offering one-word or short-phrase clues that describe their secret without giving it away to the imposter.
              </p>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-1 flex items-center gap-2">
                    <Lightbulb className="w-3.5 h-3.5" /> Imposter Tactic: The Chameleon Echo
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Never volunteer to give the first clue. Listen to the first two players, identify the sensory dimension they
                    focused on (temperature, texture, location, utility), and mirror that dimension using synonymous or broader
                    vocabulary.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1 flex items-center gap-2">
                    <Target className="w-3.5 h-3.5" /> Detective Tactic: Triangulation Questions
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Avoid binary yes/no questions. Instead, ask relative comparisons: &ldquo;Is your word more common on a weekday or
                    weekend?&rdquo; The Imposter will often pause to calculate where the majority stands.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-1 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5" /> End-Round Voting Protocol
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    During the voting phase, require everyone to verbally defend their vote. Imposters who panic often point fingers at
                    the easiest target rather than analyzing the clues logically.
                  </p>
                </div>
              </div>
            </div>

            {/* Word Chameleon Strategy Card */}
            <div className="rounded-3xl bg-black/60 border border-white/10 p-6 sm:p-10 relative overflow-hidden backdrop-blur-xl">
              <div className="flex items-center justify-between gap-2 mb-6">
                <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 text-xs font-black uppercase tracking-wider">
                  Word Chameleon Manual
                </span>
                <span className="text-xs font-mono text-gray-400">4–16 Players</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black uppercase text-white mb-4">
                Category Infiltration & The Steal
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed mb-6">
                In Word Chameleon, normal players receive a specific secret word (e.g. &ldquo;Eiffel Tower&rdquo;), but the Chameleon
                is only given the broad category (e.g. &ldquo;Famous Landmarks&rdquo;). The Chameleon must deduce the exact word from other
                players&rsquo; clues while camouflaging their own clue to avoid detection.
              </p>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-1 flex items-center gap-2">
                    <Lightbulb className="w-3.5 h-3.5" /> Chameleon Tactic: Lateral Categorization
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Anchor your clue to universal qualities of the category. If the category is &ldquo;Animals&rdquo;, words like
                    &ldquo;Fast&rdquo;, &ldquo;Mammal&rdquo;, or &ldquo;Wild&rdquo; give you high plausibility while you wait for specific clues to narrow the target down.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1 flex items-center gap-2">
                    <Target className="w-3.5 h-3.5" /> Group Tactic: Insider Clues
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Give clues that are recognizable to fellow word holders, but unhelpful to someone holding only the category.
                    If the word is &ldquo;Spider-Man&rdquo;, clue &ldquo;Queens&rdquo; or &ldquo;Uncle&rdquo; rather than &ldquo;Web&rdquo;.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" /> The Steal Mechanics
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Even if the group catches the Chameleon, the Chameleon gets one final opportunity to guess the exact secret word.
                    If correct, the Chameleon steals the victory!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions (FAQ) Accordion */}
      <section id="faq" className="py-16 sm:py-24 lg:py-32 border-t border-white/5 bg-black">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-3">
              <HelpCircle className="w-3.5 h-3.5" /> Got Questions?
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-400 text-sm sm:text-base">
              Everything you need to know about setting up rooms, fair play, supported devices, and game rules.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1" className="border border-white/10 rounded-2xl px-6 bg-zinc-950/60 data-[state=open]:border-primary/50 transition-colors">
              <AccordionTrigger className="text-base sm:text-lg font-bold text-white hover:no-underline hover:text-primary">
                What is Secret Word Room and how does it work?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-300 leading-relaxed pt-2">
                Secret Word Room is a free, web-based social party game platform inspired by modern social deduction classics like Spyfall, Chameleon, and Mafia. One host starts a private room, configures round timer options, and receives a unique 5-letter code. Other players simply type in the code on their mobile phones, tablets, or computers to join instantly without downloading an app or registering.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border border-white/10 rounded-2xl px-6 bg-zinc-950/60 data-[state=open]:border-primary/50 transition-colors">
              <AccordionTrigger className="text-base sm:text-lg font-bold text-white hover:no-underline hover:text-primary">
                Is Secret Word Room completely free to play?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-300 leading-relaxed pt-2">
                Yes! Secret Word Room is 100% free to host and join. You can create unlimited game rooms, enjoy all available game modes, and play across our entire catalog of 5,000+ curated word pairs without paywalls or subscriptions.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border border-white/10 rounded-2xl px-6 bg-zinc-950/60 data-[state=open]:border-primary/50 transition-colors">
              <AccordionTrigger className="text-base sm:text-lg font-bold text-white hover:no-underline hover:text-primary">
                Do my friends need to install an app or create an account?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-300 leading-relaxed pt-2">
                No downloads, installs, or logins are required. Players just open https://secret-word-room.vercel.app on Safari, Chrome, Firefox, or any browser, enter their nickname and the 5-letter room code, and are seated immediately.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border border-white/10 rounded-2xl px-6 bg-zinc-950/60 data-[state=open]:border-primary/50 transition-colors">
              <AccordionTrigger className="text-base sm:text-lg font-bold text-white hover:no-underline hover:text-primary">
                How many players can join a game?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-300 leading-relaxed pt-2">
                Games can be played with anywhere from 3 up to 16+ players in a single room. For social deduction games like Odd One Out, groups of 4 to 8 players tend to deliver the most thrilling balance of suspicion, discussion, and strategic bluffing.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border border-white/10 rounded-2xl px-6 bg-zinc-950/60 data-[state=open]:border-primary/50 transition-colors">
              <AccordionTrigger className="text-base sm:text-lg font-bold text-white hover:no-underline hover:text-primary">
                Can we play remotely over Zoom, Discord, or FaceTime?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-300 leading-relaxed pt-2">
                Yes! Secret Word Room is ideal for remote game nights. Everyone connects to your group voice or video call (Discord, Zoom, Google Meet, Teams, or FaceTime) while opening the room on their phone or in a split-screen browser window.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border border-white/10 rounded-2xl px-6 bg-zinc-950/60 data-[state=open]:border-primary/50 transition-colors">
              <AccordionTrigger className="text-base sm:text-lg font-bold text-white hover:no-underline hover:text-primary">
                Are words appropriate for kids, families, and classrooms?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-300 leading-relaxed pt-2">
                Yes. Our database has been curated to exclude profanity, sensitive subject matter, and inappropriate adult themes. Categories like Food, Animals, Movies, Nature, Sports, and Everyday Objects make the game safe and fun for players ages 8 and up.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7" className="border border-white/10 rounded-2xl px-6 bg-zinc-950/60 data-[state=open]:border-primary/50 transition-colors">
              <AccordionTrigger className="text-base sm:text-lg font-bold text-white hover:no-underline hover:text-primary">
                How does the zero-repetition guarantee work?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-300 leading-relaxed pt-2">
                Each room tracks every word pair served during that session in the backend database. When starting subsequent rounds, the query engine automatically excludes all previously used pairs so your group never encounters the same prompt twice in one night.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8" className="border border-white/10 rounded-2xl px-6 bg-zinc-950/60 data-[state=open]:border-primary/50 transition-colors">
              <AccordionTrigger className="text-base sm:text-lg font-bold text-white hover:no-underline hover:text-primary">
                How does Secret Word Room prevent cheating?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-300 leading-relaxed pt-2">
                All secret assignments, role distribution, and imposter selection happen strictly on the server side. A player&rsquo;s browser only receives their own secret role. Furthermore, our touch-to-reveal card design conceals words on screen until pressed, protecting you against peeking by players sitting next to you.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-9" className="border border-white/10 rounded-2xl px-6 bg-zinc-950/60 data-[state=open]:border-primary/50 transition-colors">
              <AccordionTrigger className="text-base sm:text-lg font-bold text-white hover:no-underline hover:text-primary">
                What happens if I accidentally refresh or close my browser?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-300 leading-relaxed pt-2">
                Your session token is saved securely in your browser&rsquo;s local storage. If you refresh or re-enter the room URL, the server recognizes your token and reconnects you to your active seat, preserving your nickname, role, and score without interrupting the game.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-10" className="border border-white/10 rounded-2xl px-6 bg-zinc-950/60 data-[state=open]:border-primary/50 transition-colors">
              <AccordionTrigger className="text-base sm:text-lg font-bold text-white hover:no-underline hover:text-primary">
                How do I contact support or suggest new word categories?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-300 leading-relaxed pt-2">
                We love community input! You can submit word suggestions or report issues via our <Link to="/contact" className="text-primary underline">Contact Page</Link> or by sending an email directly to <a href="mailto:support@secretwordroom.com" className="text-primary underline">support@secretwordroom.com</a>.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </main>
  );
}
