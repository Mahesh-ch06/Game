import React from "react";
import { useLogo } from "../context/LogoContext";

export type LogoVariant = "cipher" | "cube" | "minimal";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  variant?: LogoVariant;
  showWordmark?: boolean;
  className?: string;
}

export function BrandLogo({
  size = "md",
  variant,
  showWordmark = true,
  className = "",
}: BrandLogoProps) {
  let contextLogo: LogoVariant = "cube";
  try {
    const logoCtx = useLogo();
    if (logoCtx?.activeLogo) contextLogo = logoCtx.activeLogo;
  } catch {}

  const activeVariant = variant || contextLogo || "cube";

  const iconSizes = {
    sm: "h-8 w-8",
    md: "h-9 w-9 sm:h-10 sm:w-10",
    lg: "h-12 w-12 sm:h-14 sm:w-14",
  };

  const secretTextSizes = {
    sm: "text-xs sm:text-sm",
    md: "text-xs sm:text-[15px]",
    lg: "text-lg sm:text-2xl",
  };

  const wordRoomTextSizes = {
    sm: "text-[8px] sm:text-[9px]",
    md: "text-[9px] sm:text-[10px]",
    lg: "text-xs sm:text-sm",
  };

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 select-none group ${className}`}>
      {/* Brand Icon Mark */}
      <div
        className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-transparent border border-white/20 backdrop-blur-xl shadow-[0_0_24px_-4px_rgba(0,113,227,0.35)] transition-all duration-300 group-hover:scale-105 group-hover:border-primary/60 group-hover:shadow-[0_0_32px_-2px_rgba(0,113,227,0.6)] overflow-hidden`}
      >
        {/* Ambient background glow inside the icon */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent pointer-events-none" />
        <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary/25 blur-sm pointer-events-none" />

        {activeVariant === "cube" ? (
          /* Variant 2: The Secret Isometric Chamber / Room */
          <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[64%] h-[64%] relative z-10 transition-transform duration-300 group-hover:rotate-6"
          >
            <path
              d="M20 7L32 13.5V26.5L20 33L8 26.5V13.5L20 7Z"
              stroke="#0071E3"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <path
              d="M20 20L32 13.5M20 20L8 13.5M20 20V33"
              stroke="white"
              strokeOpacity="0.4"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <circle cx="20" cy="20" r="3" fill="#0071E3" />
            <circle cx="20" cy="20" r="1.5" fill="#0B0E14" />
          </svg>
        ) : activeVariant === "minimal" ? (
          /* Variant 3: Minimal SWR Monogram Ribbon */
          <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[62%] h-[62%] relative z-10 transition-transform duration-300 group-hover:scale-110"
          >
            <rect x="9" y="9" width="10" height="10" rx="3" fill="#0071E3" />
            <rect x="21" y="9" width="10" height="10" rx="3" fill="white" fillOpacity="0.2" />
            <rect x="9" y="21" width="10" height="10" rx="3" fill="white" fillOpacity="0.2" />
            <rect x="21" y="21" width="10" height="10" rx="3" fill="#0071E3" />
            <circle cx="20" cy="20" r="2.5" fill="#0B0E14" />
          </svg>
        ) : (
          /* Variant 1 (Default): The Secret Cipher & Keyhole Aperture */
          <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[64%] h-[64%] relative z-10 transition-transform duration-300 group-hover:scale-105"
          >
            <defs>
              <linearGradient id="swr-neon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="100%" stopColor="#0071E3" />
              </linearGradient>
            </defs>

            {/* Continuous 'S' Ribbon / Whisper Arc */}
            <path
              d="M28 11.5C25.8 9 22.5 8 18.8 8C13.5 8 9.8 11.6 9.8 16C9.8 19.6 12.6 21.4 16.5 22.4L19.8 23.3C23.6 24.3 25.5 25.8 25.5 28.2C25.5 31.6 22.2 33.8 17.8 33.8C13.2 33.8 10 31.4 8 28.5"
              stroke="url(#swr-neon-grad)"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Secret Keyhole / Deduction Iris Core */}
            <circle cx="20" cy="20" r="2.8" fill="#ffffff" />
            <circle cx="20" cy="20" r="1.4" fill="#0B0E14" />

            {/* Minimalist Accent Pips */}
            <circle cx="28" cy="11.5" r="1.2" fill="#ffffff" />
            <circle cx="8" cy="28.5" r="1.2" fill="#0071E3" />
          </svg>
        )}
      </div>

      {/* Wordmark Typography */}
      {showWordmark && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={`${secretTextSizes[size]} font-black tracking-[0.18em] sm:tracking-[0.22em] text-white leading-none font-display uppercase transition-colors group-hover:text-primary`}
            >
              SECRET
            </span>
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)] animate-pulse shrink-0" />
          </div>
          <span
            className={`${wordRoomTextSizes[size]} font-bold tracking-[0.22em] sm:tracking-[0.28em] text-gray-400 group-hover:text-gray-300 leading-none mt-1 uppercase font-sans`}
          >
            WORD ROOM
          </span>
        </div>
      )}
    </div>
  );
}
