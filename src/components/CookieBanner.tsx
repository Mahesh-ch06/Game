import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Cookie, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "swr_cookie_consent_v1";

export function CookieBanner() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      const consent = localStorage.getItem(STORAGE_KEY);
      if (!consent) {
        timer = setTimeout(() => setIsOpen(true), 1200);
      }
    } catch {
      // Ignore localStorage errors in private modes
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  // Listen for custom event from footer "Cookie Preferences" button
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open_cookie_preferences", handleOpen);
    return () => window.removeEventListener("open_cookie_preferences", handleOpen);
  }, []);

  const handleConsent = (choice: "all" | "essential") => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          choice,
          timestamp: new Date().toISOString(),
        })
      );
    } catch {
      // Ignore
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div
      role="region"
      aria-label="Cookie and Privacy Consent"
      className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-sm z-50 animate-in fade-in slide-in-from-bottom-3 duration-300"
    >
      <div className="liquid-glass-card rounded-2xl border border-white/20 bg-zinc-950/90 p-3.5 sm:p-4 shadow-2xl backdrop-blur-2xl text-white">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
            <Cookie className="w-4 h-4" /> Cookie & Ad Notice
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
            aria-label="Close notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-[11px] sm:text-xs text-gray-300 leading-relaxed">
          We use cookies for game sessions and Google AdSense ads in compliance with GDPR & ePrivacy regulations.
        </p>

        <div className="grid grid-cols-2 gap-2 mt-3">
          <Button
            size="sm"
            onClick={() => handleConsent("all")}
            className="h-8.5 rounded-xl bg-primary text-white hover:bg-primary-dark font-bold text-xs uppercase tracking-wider shadow-md"
          >
            <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Accept All
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleConsent("essential")}
            className="h-8.5 rounded-xl border-white/20 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 font-semibold text-xs"
          >
            Essential Only
          </Button>
        </div>

        <div className="mt-2.5 text-[10px] text-gray-400 flex items-center justify-between pt-2 border-t border-white/10">
          <Link to="/privacy" className="underline hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <a
            href="https://adssettings.google.com"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-white transition-colors"
          >
            Google Ad Settings
          </a>
        </div>
      </div>
    </div>
  );
}

export function triggerCookiePreferences() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("open_cookie_preferences"));
  }
}
