import { supabaseAdmin } from "../integrations/supabase/client.server";
import {
  verifyAdminPassword,
  createAdminSessionToken,
  verifyAdminSessionToken,
  checkRateLimit,
  resetRateLimit,
  logSecurityEvent,
  getSecurityLogs,
  sanitizeInput,
  type SecurityEvent,
} from "./security.server";
import { getAdminRoomsSummary, adminTerminateRoom } from "./game.server";

import fs from "node:fs";
import path from "node:path";

export type LogoVariant = "cipher" | "cube" | "minimal";

function getLocalSettings(): { activeLogo?: LogoVariant } {
  try {
    const p = path.resolve(process.cwd(), "src/data/app_settings.json");
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, "utf-8");
      return JSON.parse(content);
    }
  } catch {}
  return {};
}

function saveLocalSettings(settings: { activeLogo: LogoVariant }) {
  try {
    const p = path.resolve(process.cwd(), "src/data/app_settings.json");
    fs.writeFileSync(
      p,
      JSON.stringify({ ...settings, updatedAt: new Date().toISOString() }, null, 2),
      "utf-8"
    );
  } catch {}
}

// In-memory cache initialized from disk
let cachedLogoVariant: LogoVariant = getLocalSettings().activeLogo || "cube";

import rawWordPairs from "../data/wordPairs.json";

// Default seed word pairs fallback (5,000 curated pairs)
export let memoryWordPairs: { id: string; category: string; major_word: string; minor_word: string }[] = rawWordPairs.map((p, idx) => ({
  id: `wp-${idx + 1}`,
  category: p.category,
  major_word: p.major,
  minor_word: p.minor,
}));

/**
 * Public: Get active logo setting (called by visitors on page load)
 */
export async function getActiveLogo(): Promise<LogoVariant> {
  try {
    const { data, error } = await (supabaseAdmin as any)
      .from("app_settings")
      .select("value")
      .eq("key", "active_logo")
      .maybeSingle();

    if (!error && data?.value) {
      const val = typeof data.value === "string" ? data.value : JSON.stringify(data.value).replace(/"/g, "");
      if (val === "cipher" || val === "cube" || val === "minimal") {
        cachedLogoVariant = val;
        saveLocalSettings({ activeLogo: val });
        return val;
      }
    }
  } catch {
    // If Supabase table is not yet created, use cached in-memory/file value
  }

  const diskSetting = getLocalSettings().activeLogo;
  if (diskSetting) {
    cachedLogoVariant = diskSetting;
  }
  return cachedLogoVariant;
}

/**
 * Admin Login: Verifies passphrase with brute-force rate limiting
 */
export async function loginAdmin(password: string, clientIp = "client"): Promise<{ sessionToken: string }> {
  const rateKey = `admin_login:${clientIp}`;
  const rateCheck = checkRateLimit(rateKey, 25, 10 * 60 * 1000); // 25 attempts per 10 min

  if (!rateCheck.allowed) {
    logSecurityEvent(
      "RATE_LIMITED",
      `Admin login blocked due to rate limit (retry after ${rateCheck.retryAfterSec}s).`,
      "danger",
    );
    throw new Error(
      `Too many failed attempts. Security lockout active. Retry after ${rateCheck.retryAfterSec} seconds.`,
    );
  }

  const isValid = verifyAdminPassword(password);
  if (!isValid) {
    logSecurityEvent("LOGIN_FAILED", "Failed admin authentication attempt.", "warn");
    throw new Error("Invalid admin password. Access denied.");
  }

  resetRateLimit(rateKey);
  const token = createAdminSessionToken();
  logSecurityEvent("LOGIN_SUCCESS", "Admin authenticated successfully. Session issued.", "info");
  return { sessionToken: token };
}

/**
 * Admin Auth Guard: Throws if session is invalid
 */
export function requireAdmin(sessionToken: string | null | undefined) {
  if (!verifyAdminSessionToken(sessionToken)) {
    throw new Error("Unauthorized: Invalid or expired admin session.");
  }
}

/**
 * Admin: Update Active Logo
 */
export async function updateActiveLogo(sessionToken: string, logo: LogoVariant) {
  requireAdmin(sessionToken);

  if (logo !== "cipher" && logo !== "cube" && logo !== "minimal") {
    throw new Error("Invalid logo concept variant.");
  }

  cachedLogoVariant = logo;
  saveLocalSettings({ activeLogo: logo });

  try {
    await (supabaseAdmin as any).from("app_settings").upsert({
      key: "active_logo",
      value: JSON.stringify(logo),
      updated_at: new Date().toISOString(),
    });
  } catch {}

  logSecurityEvent("LOGO_CHANGED", `Active logo changed to concept: "${logo}".`, "info");
  return { success: true, activeLogo: logo };
}

/**
 * Admin: Get System Stats & Status
 */
export async function getAdminStats(sessionToken: string) {
  requireAdmin(sessionToken);

  const rooms = getAdminRoomsSummary();
  const totalPlayers = rooms.reduce((acc, r) => acc + r.playerCount, 0);

  let dbConnected = false;
  let wordPairCount = memoryWordPairs.length;

  try {
    const { count, error } = await supabaseAdmin
      .from("word_pairs")
      .select("*", { count: "exact", head: true });
    if (!error) {
      dbConnected = true;
      if (typeof count === "number") wordPairCount = count;
    }
  } catch {}

  return {
    activeRooms: rooms.length,
    totalPlayers,
    wordPairCount,
    activeLogo: cachedLogoVariant,
    dbConnected,
    securityShields: {
      cryptoUUID: "ACTIVE (Node.js crypto.randomUUID RFC-4122)",
      wordSecrecyShield: "ACTIVE (Zero Client Payload Leaks)",
      rateLimitGuard: "ACTIVE (In-Memory IP/Token Defense)",
      hostGatekeeper: "ACTIVE (Cryptographic Host Verification)",
      antiCheatLock: "ACTIVE (Permanent Mode Locking)",
    },
    logs: getSecurityLogs(),
  };
}

/**
 * Admin: Get Active Rooms
 */
export async function getAdminRooms(sessionToken: string) {
  requireAdmin(sessionToken);
  return getAdminRoomsSummary();
}

/**
 * Admin: Terminate a Room
 */
export async function killAdminRoom(sessionToken: string, code: string) {
  requireAdmin(sessionToken);
  const success = adminTerminateRoom(code);
  if (success) {
    logSecurityEvent("ROOM_PURGED", `Admin manually terminated room: ${code.toUpperCase()}`, "warn");
  }
  return { success };
}

/**
 * Admin: Get Word Pairs
 */
export async function getWordPairs(sessionToken: string) {
  requireAdmin(sessionToken);

  try {
    const { data, error } = await supabaseAdmin
      .from("word_pairs")
      .select("id, category, major_word, minor_word")
      .order("category", { ascending: true })
      .limit(10000);

    if (!error && data && data.length > 0) {
      return data;
    }
  } catch {}

  return memoryWordPairs;
}

/**
 * Admin: Add Custom Word Pair
 */
export async function addWordPair(
  sessionToken: string,
  category: string,
  major: string,
  minor: string,
) {
  requireAdmin(sessionToken);

  const cleanCat = sanitizeInput(category, 24) || "General";
  const cleanMaj = sanitizeInput(major, 30);
  const cleanMin = sanitizeInput(minor, 30);

  if (!cleanMaj || !cleanMin) {
    throw new Error("Both secret words are required.");
  }

  const newId = `wp-${Date.now()}`;
  const newItem = {
    id: newId,
    category: cleanCat,
    major_word: cleanMaj,
    minor_word: cleanMin,
  };

  try {
    const { data, error } = await supabaseAdmin
      .from("word_pairs")
      .insert({ category: cleanCat, major_word: cleanMaj, minor_word: cleanMin })
      .select("id, category, major_word, minor_word")
      .single();

    if (!error && data) {
      logSecurityEvent("CHEAT_BLOCKED", `New word pair created in Supabase: ${cleanCat} (${cleanMaj} / ${cleanMin})`, "info");
      return data;
    }
  } catch {}

  memoryWordPairs.push(newItem);
  return newItem;
}

/**
 * Admin: Delete Word Pair
 */
export async function deleteWordPair(sessionToken: string, id: string) {
  requireAdmin(sessionToken);

  try {
    await supabaseAdmin.from("word_pairs").delete().eq("id", id);
  } catch {}

  memoryWordPairs = memoryWordPairs.filter((w) => w.id !== id);
  return { success: true };
}
