import React, { createContext, useContext, useEffect, useState } from "react";
import { getActiveLogoFn } from "../lib/admin.functions";

export type LogoVariant = "cipher" | "cube" | "minimal";

interface LogoContextType {
  activeLogo: LogoVariant;
  setActiveLogo: (logo: LogoVariant) => void;
  refreshLogo: () => Promise<void>;
}

const LogoContext = createContext<LogoContextType>({
  activeLogo: "cipher",
  setActiveLogo: () => {},
  refreshLogo: async () => {},
});

export function LogoProvider({ children }: { children: React.ReactNode }) {
  const [activeLogo, setActiveLogoState] = useState<LogoVariant>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("swr_active_logo");
      if (saved === "cipher" || saved === "cube" || saved === "minimal") {
        return saved as LogoVariant;
      }
    }
    return "cube";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("swr_active_logo");
      if (saved === "cipher" || saved === "cube" || saved === "minimal") {
        setActiveLogoState(saved as LogoVariant);
      }
    }
  }, []);

  const setActiveLogo = (logo: LogoVariant) => {
    setActiveLogoState(logo);
    if (typeof window !== "undefined") {
      localStorage.setItem("swr_active_logo", logo);
      window.dispatchEvent(new CustomEvent("swr:logo-changed", { detail: logo }));
    }
  };

  const refreshLogo = async () => {
    try {
      const res = await getActiveLogoFn();
      if (res?.activeLogo && (res.activeLogo === "cipher" || res.activeLogo === "cube" || res.activeLogo === "minimal")) {
        setActiveLogoState(res.activeLogo);
        if (typeof window !== "undefined") {
          localStorage.setItem("swr_active_logo", res.activeLogo);
        }
      }
    } catch {
      // Fallback to existing saved logo
    }
  };

  useEffect(() => {
    refreshLogo();

    const handleCustom = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail === "cipher" || detail === "cube" || detail === "minimal") {
        setActiveLogoState(detail);
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "swr_active_logo" && e.newValue) {
        if (e.newValue === "cipher" || e.newValue === "cube" || e.newValue === "minimal") {
          setActiveLogoState(e.newValue as LogoVariant);
        }
      }
    };

    window.addEventListener("swr:logo-changed", handleCustom);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("swr:logo-changed", handleCustom);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return (
    <LogoContext.Provider value={{ activeLogo, setActiveLogo, refreshLogo }}>
      {children}
    </LogoContext.Provider>
  );
}

export function useLogo() {
  return useContext(LogoContext);
}
