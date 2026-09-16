import { createFileRoute } from "@tanstack/react-router";
import React, { useState, useEffect } from "react";
import { BrandLogo, type LogoVariant } from "../components/BrandLogo";
import { useLogo } from "../context/LogoContext";
import {
  adminLoginFn,
  adminGetStatsFn,
  adminUpdateLogoFn,
  adminGetRoomsFn,
  adminKillRoomFn,
  adminGetWordPairsFn,
  adminAddWordPairFn,
  adminDeleteWordPairFn,
} from "../lib/admin.functions";
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  LogOut,
  Layers,
  Sparkles,
  Gamepad2,
  BookOpen,
  Trash2,
  Plus,
  Radio,
  Clock,
  Users,
  Server,
  KeyRound,
} from "lucide-react";

export const Route = createFileRoute("/vault-swr-98x2")({
  component: AdminRoute,
});

type TabKey = "logo" | "rooms" | "words" | "security";

function AdminRoute() {
  const { activeLogo, setActiveLogo, refreshLogo } = useLogo();

  // Auth state
  const [sessionToken, setSessionToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("swr_admin_session");
    }
    return null;
  });
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard state
  const [activeTab, setActiveTab] = useState<TabKey>("logo");
  const [stats, setStats] = useState<any>(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const [wordPairs, setWordPairs] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Logo Studio state
  const [previewVariant, setPreviewVariant] = useState<LogoVariant>(activeLogo);
  const [isApplyingLogo, setIsApplyingLogo] = useState(false);

  // Add word pair form
  const [newCategory, setNewCategory] = useState("Food");
  const [newMajor, setNewMajor] = useState("");
  const [newMinor, setNewMinor] = useState("");
  const [isAddingWord, setIsAddingWord] = useState(false);

  // Search filter
  const [wordSearch, setWordSearch] = useState("");

  const showToast = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Sync previewVariant with activeLogo initially
  useEffect(() => {
    if (activeLogo) setPreviewVariant(activeLogo);
  }, [activeLogo]);

  // Load dashboard data when authenticated
  const loadDashboard = async (token: string) => {
    setIsLoadingData(true);
    try {
      const [statsData, roomsData, wordsData] = await Promise.all([
        adminGetStatsFn({ data: { sessionToken: token } }),
        adminGetRoomsFn({ data: { sessionToken: token } }),
        adminGetWordPairsFn({ data: { sessionToken: token } }),
      ]);
      setStats(statsData);
      setRooms(roomsData || []);
      setWordPairs(wordsData || []);
    } catch (err: any) {
      if (err?.message?.includes("Unauthorized")) {
        handleLogout();
      }
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (sessionToken) {
      loadDashboard(sessionToken);
    }
  }, [sessionToken]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);
    try {
      const res = await adminLoginFn({ data: { password } });
      if (res?.sessionToken) {
        setSessionToken(res.sessionToken);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("swr_admin_session", res.sessionToken);
        }
        setPassword("");
        loadDashboard(res.sessionToken);
      }
    } catch (err: any) {
      setLoginError(err?.message || "Invalid credentials. Access denied.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setSessionToken(null);
    setStats(null);
    setRooms([]);
    setWordPairs([]);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("swr_admin_session");
    }
  };

  const handleApplyLogo = async (variant: LogoVariant) => {
    if (!sessionToken) return;
    setIsApplyingLogo(true);
    try {
      await adminUpdateLogoFn({ data: { sessionToken, logo: variant } });
      setActiveLogo(variant);
      await refreshLogo();
      showToast(`✓ Active logo switched to concept "${variant.toUpperCase()}" site-wide!`);
      loadDashboard(sessionToken);
    } catch (err: any) {
      showToast(`Failed to update logo: ${err.message}`);
    } finally {
      setIsApplyingLogo(false);
    }
  };

  const handleKillRoom = async (code: string) => {
    if (!sessionToken || !confirm(`Terminate active game room ${code}?`)) return;
    try {
      await adminKillRoomFn({ data: { sessionToken, code } });
      showToast(`✓ Room ${code} terminated.`);
      loadDashboard(sessionToken);
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  const handleAddWordPair = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionToken || !newMajor.trim() || !newMinor.trim()) return;
    setIsAddingWord(true);
    try {
      await adminAddWordPairFn({
        data: {
          sessionToken,
          category: newCategory,
          major: newMajor.trim(),
          minor: newMinor.trim(),
        },
      });
      setNewMajor("");
      setNewMinor("");
      showToast("✓ New word pair added to database!");
      loadDashboard(sessionToken);
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    } finally {
      setIsAddingWord(false);
    }
  };

  const handleDeleteWordPair = async (id: string) => {
    if (!sessionToken || !confirm("Delete this word pair?")) return;
    try {
      await adminDeleteWordPairFn({ data: { sessionToken, id } });
      showToast("✓ Word pair deleted.");
      loadDashboard(sessionToken);
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  // Concept descriptions matching the screenshot
  const conceptDetails: Record<LogoVariant, { title: string; subtitle: string; liveConceptNum: number }> = {
    cipher: {
      title: "The Cipher Iris",
      subtitle: "Fluid geometric 'S' ribbon framing the secret deduction aperture.",
      liveConceptNum: 1,
    },
    cube: {
      title: "Isometric Room",
      subtitle: "3D isometric mystery chamber framing the central deduction core.",
      liveConceptNum: 2,
    },
    minimal: {
      title: "Stencil Matrix",
      subtitle: "Modern architectural ribbon matrix with quadrant illumination.",
      liveConceptNum: 3,
    },
  };

  // ==========================================
  // VIEW 1: LOCKED SECURITY VAULT (LOGIN SCREEN)
  // ==========================================
  if (!sessionToken) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[350px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-red-500/5 rounded-full blur-[90px] pointer-events-none" />

        <div className="w-full max-w-md panel border border-white/10 rounded-2xl p-8 relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
          {/* Vault Top Security Badge */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-mono tracking-widest text-red-400 font-bold uppercase">
                  SECURITY CLEARANCE REQUIRED
                </div>
                <div className="text-xs text-gray-400 font-mono">ENCRYPTED ADMIN VAULT</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-gray-400">
              <Radio className="w-3 h-3 text-red-400 animate-pulse" />
              RESTRICTED
            </div>
          </div>

          <div className="text-center mb-6">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/15 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
              <KeyRound className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-white font-display">Admin Authentication</h2>
            <p className="text-xs text-gray-400 mt-1">
              Enter the master secret passphrase to access game controls & logo customization.
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-300">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                Master Passphrase
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password..."
                  required
                  autoFocus
                  className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full h-11 rounded-xl bg-primary text-white font-bold text-sm tracking-wide transition-all hover:bg-primary-dark hover:shadow-[0_0_24px_var(--color-primary)] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Verifying Token...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Authenticate Vault Access
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/5 text-center">
            <div className="text-[10px] text-gray-400 font-mono flex items-center justify-center gap-1.5">
              <Shield className="w-3 h-3 text-primary" />
              Anti-Brute Force Protection Active • Max 5 Attempts
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: AUTHENTICATED ADMIN DASHBOARD
  // ==========================================
  return (
    <div className="min-h-screen bg-background text-white pb-16">
      {/* Toast Notification */}
      {statusMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-card border border-primary/40 text-primary shadow-[0_12px_36px_rgba(0,0,0,0.8)] backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-primary" />
          <span className="text-sm font-semibold">{statusMessage}</span>
        </div>
      )}

      {/* Admin Top Banner / Header */}
      <div className="border-b border-white/10 bg-card/60 backdrop-blur-2xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center shadow-[0_0_16px_var(--color-primary-glow)]">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-black tracking-wider text-white font-display">
                    ADMIN COMMAND CENTER
                  </h1>
                  <span className="px-2 py-0.5 rounded-full bg-primary/15 border border-primary/40 text-[10px] font-mono text-primary font-bold">
                    VAULT ACTIVE
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  Site-wide Brand Customization & Game Security Control
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => loadDashboard(sessionToken)}
                disabled={isLoadingData}
                className="h-9 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingData ? "animate-spin text-primary" : ""}`} />
                Sync Data
              </button>
              <button
                onClick={handleLogout}
                className="h-9 px-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs font-semibold text-red-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Lock Vault
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-white/5">
            <div className="px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5">
              <div className="text-[10px] uppercase font-mono tracking-wider text-gray-400">
                Active Rooms
              </div>
              <div className="text-lg font-black text-white">{stats?.activeRooms ?? rooms.length}</div>
            </div>
            <div className="px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5">
              <div className="text-[10px] uppercase font-mono tracking-wider text-gray-400">
                Connected Players
              </div>
              <div className="text-lg font-black text-primary">{stats?.totalPlayers ?? 0}</div>
            </div>
            <div className="px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5">
              <div className="text-[10px] uppercase font-mono tracking-wider text-gray-400">
                Word Pairs (DB)
              </div>
              <div className="text-lg font-black text-white">{stats?.wordPairCount ?? wordPairs.length}</div>
            </div>
            <div className="px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5">
              <div className="text-[10px] uppercase font-mono tracking-wider text-gray-400">
                Supabase Sync
              </div>
              <div className="text-xs font-mono font-bold flex items-center gap-1.5 mt-1">
                <span
                  className={`w-2 h-2 rounded-full ${stats?.dbConnected ? "bg-emerald-400" : "bg-yellow-400"} animate-pulse`}
                />
                <span className={stats?.dbConnected ? "text-emerald-400" : "text-yellow-400"}>
                  {stats?.dbConnected ? "CONNECTED" : "READY (IN-MEM)"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("logo")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === "logo"
                ? "bg-primary text-white shadow-[0_0_18px_var(--color-primary-glow)]"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Brand Identity & Logo Studio
          </button>
          <button
            onClick={() => setActiveTab("rooms")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === "rooms"
                ? "bg-primary text-white shadow-[0_0_18px_var(--color-primary-glow)]"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            Live Rooms ({rooms.length})
          </button>
          <button
            onClick={() => setActiveTab("words")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === "words"
                ? "bg-primary text-white shadow-[0_0_18px_var(--color-primary-glow)]"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Word Pairs Database
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === "security"
                ? "bg-primary text-white shadow-[0_0_18px_var(--color-primary-glow)]"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Shield className="w-4 h-4" />
            Anti-Cheat & Security Shields
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* ==================================================== */}
        {/* TAB 1: LOGO & BRAND IDENTITY STUDIO (Screenshot UI)   */}
        {/* ==================================================== */}
        {activeTab === "logo" && (
          <div className="space-y-6">
            {/* The exact screenshot replica and designer interface */}
            <div className="panel border border-white/15 rounded-3xl p-6 sm:p-8 relative overflow-hidden backdrop-blur-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

              {/* Header section matching user screenshot */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <div className="text-xs font-mono font-bold tracking-[0.2em] text-primary uppercase">
                    BRAND IDENTITY REDESIGN
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-display mt-1">
                    NEW MINIMALIST LOGO
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  <div className="px-3.5 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-primary text-xs font-mono font-bold tracking-wider uppercase shadow-[0_0_12px_var(--color-primary-glow)]">
                    DESIGNER GRADE
                  </div>
                  {activeLogo === previewVariant ? (
                    <div className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      LIVE SITE LOGO
                    </div>
                  ) : (
                    <div className="px-3 py-1 rounded-full bg-yellow-500/15 border border-yellow-500/30 text-yellow-300 text-xs font-mono font-bold">
                      PREVIEW ONLY
                    </div>
                  )}
                </div>
              </div>

              {/* Main Showcase Hero Box (Matches uploaded screenshot card) */}
              <div className="my-8 rounded-2xl bg-black/60 border border-white/10 p-8 sm:p-12 flex flex-col items-center justify-center text-center relative shadow-[inset_0_2px_12px_rgba(255,255,255,0.04)]">
                <div className="mb-6 scale-125 sm:scale-150 transition-transform duration-300">
                  <BrandLogo size="lg" variant={previewVariant} />
                </div>

                <div className="max-w-lg mt-4">
                  <div className="text-sm sm:text-base text-gray-300 font-sans">
                    <span className="font-semibold text-white">
                      Concept {conceptDetails[previewVariant].liveConceptNum}: {conceptDetails[previewVariant].title}
                    </span>{" "}
                    — {conceptDetails[previewVariant].subtitle}
                  </div>
                </div>
              </div>

              {/* Concept Switcher Selection Row */}
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-3">
                  SELECT DESIGN CONCEPT:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Concept 1: The Cipher */}
                  <button
                    type="button"
                    onClick={() => setPreviewVariant("cipher")}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      previewVariant === "cipher"
                        ? "bg-white/[0.08] border-white text-white shadow-[0_0_20px_rgba(255,255,255,0.15)] ring-1 ring-white"
                        : "bg-white/[0.02] border-white/10 text-gray-400 hover:text-white hover:bg-white/[0.05]"
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-2">
                        1. The Cipher {activeLogo === "cipher" && <span className="text-[11px] text-primary">(Live)</span>}
                      </div>
                      <div className="text-[11px] text-gray-400 mt-0.5">Deduction Aperture</div>
                    </div>
                    <BrandLogo size="sm" variant="cipher" showWordmark={false} />
                  </button>

                  {/* Concept 2: Isometric Room */}
                  <button
                    type="button"
                    onClick={() => setPreviewVariant("cube")}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      previewVariant === "cube"
                        ? "bg-white/[0.08] border-white text-white shadow-[0_0_20px_rgba(255,255,255,0.15)] ring-1 ring-white"
                        : "bg-white/[0.02] border-white/10 text-gray-400 hover:text-white hover:bg-white/[0.05]"
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-2">
                        2. Isometric Room {activeLogo === "cube" && <span className="text-[11px] text-primary">(Live)</span>}
                      </div>
                      <div className="text-[11px] text-gray-400 mt-0.5">3D Geometric Chamber</div>
                    </div>
                    <BrandLogo size="sm" variant="cube" showWordmark={false} />
                  </button>

                  {/* Concept 3: Stencil Matrix */}
                  <button
                    type="button"
                    onClick={() => setPreviewVariant("minimal")}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      previewVariant === "minimal"
                        ? "bg-white/[0.08] border-white text-white shadow-[0_0_20px_rgba(255,255,255,0.15)] ring-1 ring-white"
                        : "bg-white/[0.02] border-white/10 text-gray-400 hover:text-white hover:bg-white/[0.05]"
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-2">
                        3. Stencil Matrix {activeLogo === "minimal" && <span className="text-[11px] text-primary">(Live)</span>}
                      </div>
                      <div className="text-[11px] text-gray-400 mt-0.5">Architectural Ribbon</div>
                    </div>
                    <BrandLogo size="sm" variant="minimal" showWordmark={false} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-gray-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Applying persists choice to Supabase and updates navbar, mobile dock, and footer immediately.
                </div>

                <button
                  type="button"
                  disabled={isApplyingLogo || activeLogo === previewVariant}
                  onClick={() => handleApplyLogo(previewVariant)}
                  className="w-full sm:w-auto h-12 px-8 rounded-xl bg-primary text-white font-bold text-sm tracking-wide shadow-[0_0_24px_var(--color-primary-glow)] hover:bg-primary-dark hover:shadow-[0_0_36px_var(--color-primary)] active:scale-95 disabled:opacity-40 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isApplyingLogo ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Saving to Supabase...
                    </>
                  ) : activeLogo === previewVariant ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Concept Currently Live
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Apply Concept as Active Site Logo
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Live Context Mockups (Shows how it looks in Navbar, Mobile, and Footer) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="panel border border-white/10 rounded-2xl p-6">
                <div className="text-xs font-mono uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" />
                  Live Navbar Mockup Preview
                </div>
                <div className="rounded-xl border border-white/10 bg-black/80 px-4 py-3 flex items-center justify-between">
                  <BrandLogo size="md" variant={previewVariant} />
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 hidden sm:inline">Games</span>
                    <span className="text-xs text-gray-400 hidden sm:inline">How It Works</span>
                    <span className="px-3 py-1 rounded-full bg-white text-black text-[11px] font-bold">PLAY</span>
                  </div>
                </div>
              </div>

              <div className="panel border border-white/10 rounded-2xl p-6">
                <div className="text-xs font-mono uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" />
                  Live Footer Mockup Preview
                </div>
                <div className="rounded-xl border border-white/10 bg-black/60 px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <BrandLogo size="sm" variant={previewVariant} />
                  <span className="text-[11px] text-gray-500 font-mono">
                    © 2026 Secret Word Room • All Rights Reserved
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 2: LIVE GAMES & ROOMS MONITOR                    */}
        {/* ==================================================== */}
        {activeTab === "rooms" && (
          <div className="space-y-6">
            <div className="panel border border-white/15 rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white font-display">Active Game Rooms</h3>
                  <p className="text-xs text-gray-400">
                    Real-time monitoring of live game lobbies, rounds, and connected players.
                  </p>
                </div>
                <button
                  onClick={() => loadDashboard(sessionToken)}
                  className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Refresh Rooms
                </button>
              </div>

              {rooms.length === 0 ? (
                <div className="py-12 text-center text-gray-400 border border-dashed border-white/10 rounded-xl">
                  <Gamepad2 className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                  <div className="text-sm font-semibold">No Active Rooms Right Now</div>
                  <div className="text-xs mt-1">Rooms will appear here in real-time when created by players.</div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-gray-400 font-mono uppercase">
                        <th className="pb-3 px-3">Room Code</th>
                        <th className="pb-3 px-3">Game Mode</th>
                        <th className="pb-3 px-3">Phase</th>
                        <th className="pb-3 px-3">Round</th>
                        <th className="pb-3 px-3">Players</th>
                        <th className="pb-3 px-3">Host</th>
                        <th className="pb-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {rooms.map((r) => (
                        <tr key={r.code} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3.5 px-3">
                            <span className="px-2.5 py-1 rounded bg-primary/15 border border-primary/30 text-primary font-mono font-bold tracking-wider text-sm">
                              {r.code}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 font-semibold uppercase text-gray-300">
                            {r.gameMode?.replace(/_/g, " ")}
                          </td>
                          <td className="py-3.5 px-3">
                            <span className="px-2 py-0.5 rounded bg-white/10 text-white font-mono text-[11px]">
                              {r.phase}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 font-mono text-gray-400">#{r.round}</td>
                          <td className="py-3.5 px-3 font-mono font-bold text-white">
                            {r.playerCount} players
                          </td>
                          <td className="py-3.5 px-3 text-gray-300">{r.hostNickname}</td>
                          <td className="py-3.5 px-3 text-right">
                            <button
                              onClick={() => handleKillRoom(r.code)}
                              className="px-2.5 py-1 rounded bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 font-semibold transition-colors cursor-pointer"
                            >
                              Terminate
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 3: WORD PAIRS DATABASE                            */}
        {/* ==================================================== */}
        {activeTab === "words" && (
          <div className="space-y-6">
            {/* Add New Word Pair Box */}
            <div className="panel border border-white/15 rounded-2xl p-6">
              <h3 className="text-base font-bold text-white font-display mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-primary" />
                Add Custom Word Pair
              </h3>

              <form onSubmit={handleAddWordPair} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-gray-400 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-primary"
                  >
                    <option value="Food">Food & Drinks</option>
                    <option value="Places">Places & Travel</option>
                    <option value="Jobs">Jobs & Careers</option>
                    <option value="Sports">Sports & Games</option>
                    <option value="Animals">Animals</option>
                    <option value="Objects">Objects & Gadgets</option>
                    <option value="Movies">Movies & Pop Culture</option>
                    <option value="Life">Life & Events</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-gray-400 mb-1">
                    Majority Word (Town)
                  </label>
                  <input
                    type="text"
                    value={newMajor}
                    onChange={(e) => setNewMajor(e.target.value)}
                    placeholder="e.g. Pizza"
                    required
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-gray-400 mb-1">
                    Minority Word (Impostor)
                  </label>
                  <input
                    type="text"
                    value={newMinor}
                    onChange={(e) => setNewMinor(e.target.value)}
                    placeholder="e.g. Burger"
                    required
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={isAddingWord}
                    className="w-full h-[38px] rounded-xl bg-primary text-white font-bold text-xs tracking-wide hover:bg-primary-dark transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-md shadow-primary/25"
                  >
                    <Plus className="w-4 h-4" />
                    {isAddingWord ? "Saving..." : "Add Word Pair"}
                  </button>
                </div>
              </form>
            </div>

            {/* Word Pairs Directory */}
            <div className="panel border border-white/15 rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    Word Pairs Catalog ({stats?.wordPairCount ?? wordPairs.length})
                  </h3>
                  <p className="text-xs text-gray-400">
                    Stored in Supabase PostgreSQL database `public.word_pairs`.
                  </p>
                </div>

                <input
                  type="text"
                  value={wordSearch}
                  onChange={(e) => setWordSearch(e.target.value)}
                  placeholder="Search words or categories..."
                  className="w-full sm:w-64 bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="overflow-x-auto max-h-[500px]">
                <table className="w-full text-left text-xs">
                  <thead className="sticky top-0 bg-card border-b border-white/10">
                    <tr className="text-gray-400 font-mono uppercase">
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Majority Word</th>
                      <th className="py-2.5 px-3">Minority Word</th>
                      <th className="py-2.5 px-3 text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {wordPairs
                      .filter((w) => {
                        if (!wordSearch.trim()) return true;
                        const s = wordSearch.toLowerCase();
                        return (
                          w.category?.toLowerCase().includes(s) ||
                          w.major_word?.toLowerCase().includes(s) ||
                          w.minor_word?.toLowerCase().includes(s)
                        );
                      })
                      .map((w) => (
                        <tr key={w.id} className="hover:bg-white/[0.02]">
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded bg-white/5 text-gray-300 font-mono text-[11px]">
                              {w.category}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-white">{w.major_word}</td>
                          <td className="py-2.5 px-3 font-semibold text-primary">{w.minor_word}</td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => handleDeleteWordPair(w.id)}
                              className="p-1.5 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-300 transition-colors cursor-pointer"
                              title="Delete word pair"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 4: ANTI-CHEAT & SECURITY SHIELD                   */}
        {/* ==================================================== */}
        {activeTab === "security" && (
          <div className="space-y-6">
            {/* Active Shields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="panel border border-emerald-500/30 rounded-2xl p-5 bg-emerald-500/[0.03]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Cryptographic Token Shield</h4>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase">
                      RFC-4122 UUID v4 Active
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-300">
                  Player tokens are generated using native Node.js CSPRNG (`crypto.randomUUID()`), completely eliminating token predictability, session hijacking, or player seat spoofing.
                </p>
              </div>

              <div className="panel border border-emerald-500/30 rounded-2xl p-5 bg-emerald-500/[0.03]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Word & Role Obfuscation Shield</h4>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase">
                      Zero Client-Side Payload Leak
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-300">
                  Server strictly sanitizes all state payloads. A player's client receives ONLY their own secret word or role; opponent words and mafia identities are physically scrubbed from the HTTP response.
                </p>
              </div>

              <div className="panel border border-emerald-500/30 rounded-2xl p-5 bg-emerald-500/[0.03]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Rate-Limit & Anti-DDoS Defense</h4>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase">
                      Brute-Force Guard Active
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-300">
                  Defends room codes from dictionary and brute-force scans. Locks out rapid room creation, duplicate vote submissions, and malicious API flood attempts.
                </p>
              </div>

              <div className="panel border border-emerald-500/30 rounded-2xl p-5 bg-emerald-500/[0.03]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Anti-Cheat Mode Locking</h4>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase">
                      Strict Exploit Prevention
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-300">
                  Once a room is provisioned, its game mode is permanently locked in immutable memory. Any client manipulation, API tampering, or exploit attempting to switch modes is rejected with an exception.
                </p>
              </div>
            </div>

            {/* Audit Logs Stream */}
            <div className="panel border border-white/15 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                  <Server className="w-4 h-4 text-primary" />
                  Security Event Audit Logs
                </h3>
                <span className="text-xs font-mono text-gray-400">Real-Time In-Memory Audit Trail</span>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/70 p-4 font-mono text-xs max-h-72 overflow-y-auto space-y-2">
                {(stats?.logs || []).map((log: any) => (
                  <div key={log.id} className="flex items-start gap-2 text-gray-300">
                    <span className="text-gray-500 shrink-0">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                        log.severity === "danger"
                          ? "bg-red-500/20 text-red-300"
                          : log.severity === "warn"
                          ? "bg-yellow-500/20 text-yellow-300"
                          : "bg-emerald-500/20 text-emerald-300"
                      }`}
                    >
                      {log.type}
                    </span>
                    <span className="flex-1">{log.details}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
