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
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="rounded-2xl border border-white/15 bg-zinc-950/95 p-5 shadow-2xl backdrop-blur-2xl text-white">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
            <Cookie className="w-4 h-4" /> Cookie & Advertising Notice
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white transition-colors p-1"
            aria-label="Close notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed mb-4">
          Secret Word Room uses cookies to maintain game sessions and show relevant ads via Google AdSense. In
          compliance with GDPR and ePrivacy regulations, you can customize your advertising consent preferences.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Button
            size="sm"
            onClick={() => handleConsent("all")}
            className="bg-primary text-black hover:bg-white font-bold text-xs uppercase tracking-wider flex-1"
          >
            <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Accept All
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleConsent("essential")}
            className="border-white/20 text-gray-300 hover:text-white hover:bg-white/10 text-xs flex-1"
          >
            Essential Only
          </Button>
        </div>

        <div className="mt-3 text-[11px] text-gray-400 flex items-center justify-between pt-2 border-t border-white/10">
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
