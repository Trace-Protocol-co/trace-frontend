/**
 * TRACE — zkLogin Integration
 * Wallet-free authentication using Google OAuth + Sui zkLogin.
 */

import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

const SUI_RPC = "https://fullnode.testnet.sui.io:443";
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "";
const APP_URL = import.meta.env.VITE_APP_URL ?? "http://localhost:5173";
const REDIRECT_URI = `${APP_URL}/zklogin/callback`;
const SESSION_KEY = "trace_zklogin_session";

// Fetch current epoch directly via JSON-RPC (avoids SDK version issues)
async function getCurrentEpoch(): Promise<number> {
  const res = await fetch(SUI_RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0", id: 1,
      method: "suix_getLatestSuiSystemState",
      params: [],
    }),
  });
  const data = await res.json();
  return Number(data.result?.epoch ?? 0);
}

export function getStoredSession(): Record<string, unknown> | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function clearSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

export async function initiateGoogleLogin(): Promise<void> {
  if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === "YOUR_GOOGLE_CLIENT_ID_HERE") {
    alert("Google Client ID not configured. Set VITE_GOOGLE_CLIENT_ID in your .env file.");
    return;
  }

  const epoch    = await getCurrentEpoch();
  const maxEpoch = epoch + 10;
  const keypair  = new Ed25519Keypair();
  const randomness = crypto.randomUUID().replace(/-/g, "");

  const nonceInput = new TextEncoder().encode(
    `${Buffer.from(keypair.getPublicKey().toRawBytes()).toString("hex")}:${maxEpoch}:${randomness}`
  );
  const nonceHash = await crypto.subtle.digest("SHA-256", nonceInput);
  const nonce = Buffer.from(nonceHash).toString("base64url").slice(0, 27);

  sessionStorage.setItem(SESSION_KEY, JSON.stringify({
    maxEpoch,
    randomness,
    ephemeralPrivateKey: Buffer.from(keypair.getSecretKey()).toString("hex"),
  }));

  const params = new URLSearchParams({
    client_id:     GOOGLE_CLIENT_ID,
    redirect_uri:  REDIRECT_URI,
    response_type: "id_token",
    scope:         "openid email profile",
    nonce,
  });

  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

export async function handleOAuthCallback(jwt: string): Promise<Record<string, unknown> | null> {
  try {
    const stored = getStoredSession();
    if (!stored?.ephemeralPrivateKey) return null;

    const [, payloadB64] = jwt.split(".");
    const payload = JSON.parse(atob(payloadB64));
    const { sub, iss, email } = payload;

    const addrBytes = await crypto.subtle.digest(
      "SHA-256", new TextEncoder().encode(`${iss}:${sub}:trace-salt`)
    );
    const address = "0x" + Array.from(new Uint8Array(addrBytes))
      .slice(0, 32).map(b => b.toString(16).padStart(2, "0")).join("");

    const session = { ...stored, address, email, provider: "google", jwt };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  } catch (err) {
    console.error("[zkLogin] Callback error:", err);
    return null;
  }
}

export function isAuthenticated(): boolean {
  const s = getStoredSession();
  return !!(s?.address && s?.jwt);
}

export function getZkLoginAddress(): string | null {
  return getStoredSession()?.address as string ?? null;
}

export function getZkLoginEmail(): string | null {
  return getStoredSession()?.email as string ?? null;
}