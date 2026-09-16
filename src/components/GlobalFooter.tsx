import { Link } from "@tanstack/react-router";
import { BrandLogo } from "./BrandLogo";
import { triggerCookiePreferences } from "./CookieBanner";
import { ShieldCheck, Sparkles, Heart } from "lucide-react";

export function GlobalFooter() {
  return (
    <footer className="border-t border-white/10 bg-black/95 text-white pt-14 pb-28 sm:pb-16 mt-auto relative z-10">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <BrandLogo size="md" />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              The premier zero-install social party gaming platform. Gather friends, share a 5-letter room code, and
              unleash your bluffing and deduction skills instantly on any phone, tablet, or desktop.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 pt-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>5,000+ Curated Word Pairs Active</span>
            </div>
          </div>

          {/* Games Column */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-primary font-mono">
              Party Games
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link
                  to="/games/$slug"
                  params={{ slug: "odd-one-out" }}
                  className="hover:text-white transition-colors"
                >
                  Odd One Out
                </Link>
              </li>
              <li>
                <Link
                  to="/games/$slug"
                  params={{ slug: "word-chameleon" }}
                  className="hover:text-white transition-colors"
                >
                  Word Chameleon
                </Link>
              </li>
              <li>
                <Link to="/games" className="hover:text-white transition-colors">
                  Game Library
                </Link>
              </li>
              <li>
                <a href="/#categories" className="hover:text-white transition-colors">
                  Word Categories
                </a>
              </li>
            </ul>
          </div>

          {/* Rules & Guides Column */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-primary font-mono">
              Guides & Rules
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="/#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="/#guides" className="hover:text-white transition-colors">
                  Imposter Strategies
                </a>
              </li>
              <li>
                <a href="/#faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About the Platform
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Trust Column (Crucial for AdSense) */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-primary font-mono">
              Legal & Support
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={triggerCookiePreferences}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Cookie Preferences
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright and disclosures */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} Secret Word Room. Built for friends, families, and party game lovers.
          </p>
          <div className="flex items-center gap-4 text-gray-400 text-center sm:text-right">
            <span>Verified Publisher</span>
            <span>•</span>
            <span>Family-Friendly Content</span>
            <span>•</span>
            <span>Zero-Install PWA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
