import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, FileText, CheckCircle2, ShieldAlert, HelpCircle, Mail } from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service | Secret Word Room" },
      {
        name: "description",
        content:
          "Terms of Service and user agreement for Secret Word Room. Rules of fair play, acceptable use, and platform disclaimers.",
      },
    ],
  }),
  component: TermsPage,
});

export function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 sm:px-6 py-12 pb-32 text-white">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <div className="panel p-8 sm:p-12 border border-white/10 rounded-3xl space-y-10 bg-zinc-950/80 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-primary mb-2">
            <FileText className="w-4 h-4" /> Agreement & Terms
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-white">
            Terms of Service
          </h1>
          <p className="text-xs text-gray-400 mt-2 font-mono">
            Last Updated: September 16, 2026 · Effective Immediately
          </p>
        </div>

        {/* 1. Acceptance */}
        <section className="space-y-3 text-sm text-gray-300 leading-relaxed">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" /> 1. Acceptance of Terms
          </h2>
          <p>
            By accessing or playing on <strong>Secret Word Room</strong> (the &ldquo;Service&rdquo;, available at{" "}
            <a href="https://secret-word-room.vercel.app" className="text-primary hover:underline">
              https://secret-word-room.vercel.app
            </a>
            ), you signify your agreement to these Terms of Service. If you do not agree to these terms, please do not
            use the Service.
          </p>
        </section>

        {/* 2. Nature of Service */}
        <section className="space-y-3 text-sm text-gray-300 leading-relaxed">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" /> 2. Description of Service
          </h2>
          <p>
            Secret Word Room provides an online, browser-based multiplayer social deduction party game experience. The
            Service allows hosts to create temporary game rooms with customizable rules and timer lengths, and invite
            participants via unique 5-letter alphanumeric room codes. No user registration or login is required.
          </p>
        </section>

        {/* 3. Community Guidelines & Acceptable Use */}
        <section className="space-y-3 text-sm text-gray-300 leading-relaxed">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-primary" /> 3. Fair Play & Community Guidelines
          </h2>
          <p>When using Secret Word Room, you agree NOT to:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-gray-400">
            <li>Select nicknames that are harassing, defamatory, vulgar, sexually explicit, or racially abusive.</li>
            <li>Deploy automated scripts, bots, scrapers, or exploits to interfere with server performance or game lobbies.</li>
            <li>Attempt to probe, reverse engineer, or compromise the server APIs or WebSocket connections.</li>
            <li>Impersonate other individuals or project administrators in room chats or forums.</li>
          </ul>
        </section>

        {/* 4. Intellectual Property */}
        <section className="space-y-3 text-sm text-gray-300 leading-relaxed">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" /> 4. Intellectual Property
          </h2>
          <p>
            All original graphics, interface designs, game logic, logos, and curated word catalogs on Secret Word Room
            are the property of Secret Word Room and protected by applicable copyright, trademark, and intellectual
            property laws. You may not duplicate or resell any portion of the service without explicit written permission.
          </p>
        </section>

        {/* 5. Advertising and Third-Party Links */}
        <section className="space-y-3 text-sm text-gray-300 leading-relaxed">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" /> 5. Advertisements & Third Parties
          </h2>
          <p>
            To keep Secret Word Room free for everyone, the Service displays advertisements supplied by Google AdSense
            and third-party networks. We do not endorse any products or services advertised by third-party links, and
            users interact with third-party advertisers at their own discretion.
          </p>
        </section>

        {/* 6. Limitation of Liability */}
        <section className="space-y-3 text-sm text-gray-300 leading-relaxed">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-primary" /> 6. Disclaimer of Warranties & Limitation of Liability
          </h2>
          <p>
            The Service is provided on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis. Secret Word Room
            makes no representations or warranties of any kind regarding server uptime, uninterrupted gameplay, or the
            accuracy of community-submitted words. Under no circumstances will Secret Word Room be liable for any direct,
            indirect, or consequential damages resulting from the use or inability to use the Service.
          </p>
        </section>

        {/* 7. Contact */}
        <section className="space-y-3 text-sm text-gray-300 leading-relaxed border-t border-white/10 pt-6">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary" /> 7. Contact Us
          </h2>
          <p>
            For any inquiries or legal notices regarding these Terms, please email:{" "}
            <a href="mailto:support@secretwordroom.com" className="text-primary underline">
              support@secretwordroom.com
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
