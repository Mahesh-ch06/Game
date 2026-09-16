import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, Shield, Users, Zap, Heart, Gamepad2, Award } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Secret Word Room | Premium Social Party Games" },
      {
        name: "description",
        content:
          "Learn about Secret Word Room, our mission to create instant, zero-install multiplayer social deduction games, our curated word engine, and privacy-first design.",
      },
    ],
  }),
  component: AboutPage,
});

export function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 sm:px-6 py-12 pb-32 text-white">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      {/* Hero Header */}
      <div className="panel p-8 sm:p-14 border border-white/10 rounded-3xl bg-zinc-950/90 backdrop-blur-xl relative overflow-hidden mb-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Our Mission & Story
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white mb-6">
            Social Gaming, <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-purple-400">
              Zero Friction.
            </span>
          </h1>
          <p className="text-base sm:text-xl text-gray-300 font-medium leading-relaxed max-w-3xl">
            Secret Word Room was created with one simple principle: party games should bring people together
            instantly, without requiring app store downloads, user logins, or subscriptions. One player creates
            a room, shares a simple code, and everyone jumps straight into the fun.
          </p>
        </div>
      </div>

      {/* Core Values / Why We Exist */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.03] border border-white/10 relative overflow-hidden">
          <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center mb-4">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Instant Play</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            No downloads, no installations, and no account passwords. Play right in any modern web browser on iPhone,
            Android, iPad, Mac, or PC.
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.03] border border-white/10 relative overflow-hidden">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Server-Side Fairness</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            All secret assignments, role distributions, and imposter picks are generated and validated on secure
            servers. Cheating via browser inspection is impossible.
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.03] border border-white/10 relative overflow-hidden">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Family & Classroom Safe</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Over 5,000 word pairs are vetted to ensure clean, family-friendly fun. Ideal for game nights, holiday
            gatherings, work socials, and classrooms.
          </p>
        </div>
      </div>

      {/* Detailed Story & Technology */}
      <div className="space-y-8 bg-zinc-950/60 border border-white/10 rounded-3xl p-8 sm:p-12 mb-12">
        <section className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <Award className="w-6 h-6 text-primary" /> The Secret Word Room Difference
          </h2>
          <p className="text-gray-300 leading-relaxed text-base sm:text-lg">
            Traditional party board games are fun, but passing around physical cards or phone handsets inevitably
            gives away clues through body language, glance direction, or smudged cards. Many mobile apps attempt to
            solve this, but force each guest to download a 200MB app from an app store, register with an email, and
            navigate cluttered menus.
          </p>
          <p className="text-gray-300 leading-relaxed text-base sm:text-lg">
            Secret Word Room solves this with modern web technology: every player connects their own screen via
            real-time WebSockets. Your secret role remains securely concealed on your device with touch-to-reveal
            cards, giving everyone the authentic poker-face thrill of live social deduction.
          </p>
        </section>

        <section className="space-y-4 pt-6 border-t border-white/10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <Users className="w-6 h-6 text-primary" /> Curated Content & Zero-Repetition Guarantee
          </h2>
          <p className="text-gray-300 leading-relaxed text-base sm:text-lg">
            Nothing ruins a word game faster than receiving the exact same word pair three rounds in. Our proprietary
            database catalog contains thousands of distinct word pairs across 14 categories (Food, Animals, Movies,
            Travel, Science, Everyday Objects, and more).
          </p>
          <p className="text-gray-300 leading-relaxed text-base sm:text-lg">
            Each active room session tracks previously served pairs and applies strict exclusion filters, ensuring you
            enjoy a fresh, surprising, and engaging experience round after round.
          </p>
        </section>

        <section className="space-y-4 pt-6 border-t border-white/10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <Gamepad2 className="w-6 h-6 text-primary" /> Supported Platforms & Play Modes
          </h2>
          <p className="text-gray-300 leading-relaxed text-base sm:text-lg">
            Secret Word Room supports groups from 3 to 16+ players. Whether you're sitting together around a living
            room coffee table, hosting a company team-building session over Zoom or Microsoft Teams, or hanging out in
            a Discord voice channel with friends across different time zones, the experience is smooth, responsive,
            and latency-optimized.
          </p>
        </section>
      </div>

      {/* CTA Box */}
      <div className="text-center p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-zinc-900 to-black border border-white/15">
        <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white mb-4">
          Ready to Test Your Deception Skills?
        </h2>
        <p className="text-gray-400 mb-8 max-w-xl mx-auto text-sm sm:text-base">
          Start a free room in 5 seconds. Share your code with friends and see who among you is the ultimate imposter.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/games"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-primary text-black font-black uppercase tracking-widest text-sm hover:bg-white transition-colors shadow-lg shadow-primary/20"
          >
            Play Now
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full border border-white/20 bg-white/5 text-white font-bold uppercase tracking-widest text-sm hover:bg-white/10 transition-colors"
          >
            Contact Team
          </Link>
        </div>
      </div>
    </main>
  );
}
