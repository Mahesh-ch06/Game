import crypto from "node:crypto";

// Rate limiting map: key -> { count: number, resetAt: number }
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number,
): { allowed: boolean; remaining: number; retryAfterSec?: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || entry.resetAt <= now) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (entry.count >= maxRequests) {
    const retryAfterSec = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, remaining: 0, retryAfterSec };
  }

  entry.count++;
  return { allowed: true, remaining: maxRequests - entry.count };
}

// Reset rate limit key (e.g. on successful admin login)
export function resetRateLimit(key: string) {
  rateLimitMap.delete(key);
}

// Cryptographically secure UUID generation
export function generateSecureUUID(): string {
  if (typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return crypto.randomBytes(16).toString("hex");
}

// Sanitize user inputs to prevent XSS, HTML injection, and control character tampering
export function sanitizeInput(input: string, maxLength = 32): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/<[^>]*>?/gm, "") // Strip full HTML tags
    .replace(/[<>'"&/\\`]/g, "") // Strip remaining HTML/script characters
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // Strip invisible control characters
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, maxLength);
}

// Admin secret & timing-safe password verification
function getAdminPassword(): string {
  return process.env["ADMIN_PASSWORD"] || "secretadmin2026";
}

function getSessionSecret(): string {
  const seed =
    process.env["ADMIN_SESSION_SECRET"] ||
    process.env["ADMIN_PASSWORD"] ||
    process.env["SUPABASE_SERVICE_ROLE_KEY"] ||
    "swr_admin_session_vault_persistent_seed_2026";

  return crypto.createHash("sha256").update(`swr-admin-vault:${seed}`).digest("hex");
}

export function verifyAdminPassword(password: string): boolean {
  const adminSecret = getAdminPassword();
  const inputBuffer = Buffer.from(password);
  const targetBuffer = Buffer.from(adminSecret);

  if (inputBuffer.length !== targetBuffer.length) {
    // Constant-time dummy comparison to mitigate timing attacks
    crypto.timingSafeEqual(targetBuffer, targetBuffer);
    return false;
  }
  return crypto.timingSafeEqual(inputBuffer, targetBuffer);
}

// Issue HMAC-signed session token for admin dashboard (valid for 7 days)
export function createAdminSessionToken(): string {
  const secret = getSessionSecret();
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const payload = `admin:${expiresAt}`;
  const hmac = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  const encodedPayload = Buffer.from(payload).toString("base64url");
  return `${encodedPayload}.${hmac}`;
}

export function verifyAdminSessionToken(token: string | null | undefined): boolean {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [encodedPayload, receivedHmac] = parts;
  if (!encodedPayload || !receivedHmac) return false;

  try {
    const payload = Buffer.from(encodedPayload, "base64url").toString("utf8");
    const [role, expiresStr] = payload.split(":");
    if (role !== "admin" || !expiresStr) return false;

    const expiresAt = parseInt(expiresStr, 10);
    if (isNaN(expiresAt) || expiresAt < Date.now()) return false;

    const secret = getSessionSecret();
    const expectedHmac = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    const a = Buffer.from(receivedHmac, "hex");
    const b = Buffer.from(expectedHmac, "hex");
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

// Audit log for security dashboard
export type SecurityEvent = {
  id: string;
  timestamp: string;
  type: "LOGIN_SUCCESS" | "LOGIN_FAILED" | "RATE_LIMITED" | "ROOM_PURGED" | "LOGO_CHANGED" | "CHEAT_BLOCKED";
  details: string;
  severity: "info" | "warn" | "danger";
};

const securityLogs: SecurityEvent[] = [
  {
    id: generateSecureUUID(),
    timestamp: new Date().toISOString(),
    type: "LOGIN_SUCCESS",
    details: "Security Shield & Cryptographic Engine Initialized.",
    severity: "info",
  },
];

export function logSecurityEvent(
  type: SecurityEvent["type"],
  details: string,
  severity: SecurityEvent["severity"] = "info",
) {
  securityLogs.unshift({
    id: generateSecureUUID(),
    timestamp: new Date().toISOString(),
    type,
    details,
    severity,
  });
  if (securityLogs.length > 80) securityLogs.pop();
}

export function getSecurityLogs(): SecurityEvent[] {
  return [...securityLogs];
}
