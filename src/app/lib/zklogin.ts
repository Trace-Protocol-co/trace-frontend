/**
 * TRACE — zkLogin Integration (Browser-compatible, no Node globals)
 */

const SUI_RPC = "https://fullnode.testnet.sui.io:443";
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "";
const APP_URL = (import.meta.env.VITE_APP_URL ?? window.location.origin).trim().replace(/\/$/, "");
const SESSION_KEY = "trace_zklogin_session";

async function getCurrentEpoch(): Promise<number> {
  const res = await fetch(SUI_RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "suix_getLatestSuiSystemState", params: [] }),
  });
  const data = await res.json();
  return Number(data.result?.epoch ?? 0);
}

function uint8ToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
}

function base64urlEncode(bytes: Uint8Array): string {
  const base64 = btoa(String.fromCharCode(...bytes));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
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
    alert("Google Client ID not configured. Add VITE_GOOGLE_CLIENT_ID to your environment variables.");
    return;
  }

  const epoch    = await getCurrentEpoch();
  const maxEpoch = epoch + 10;

  // Generate ephemeral keypair using Web Crypto
  const keyPair = await crypto.subtle.generateKey(
    { name: "Ed25519" } as EcKeyGenParams,
    true,
    ["sign", "verify"]
  );
  const pubKeyBytes = new Uint8Array(await crypto.subtle.exportKey("raw", keyPair.publicKey));
  const privKeyBytes = new Uint8Array(await crypto.subtle.exportKey("pkcs8", keyPair.privateKey));

  const randomBytes = crypto.getRandomValues(new Uint8Array(16));
  const randomness  = uint8ToHex(randomBytes);

  // Nonce = base64url(sha256(pubkey + epoch + randomness))[:27]
  const nonceInput  = new TextEncoder().encode(`${uint8ToHex(pubKeyBytes)}:${maxEpoch}:${randomness}`);
  const nonceHash   = new Uint8Array(await crypto.subtle.digest("SHA-256", nonceInput));
  const nonce       = base64urlEncode(nonceHash).slice(0, 27);

  sessionStorage.setItem(SESSION_KEY, JSON.stringify({
    maxEpoch,
    randomness,
    pubKeyHex:  uint8ToHex(pubKeyBytes),
    privKeyHex: uint8ToHex(privKeyBytes),
  }));

  const params = new URLSearchParams({
    client_id:     GOOGLE_CLIENT_ID,
    redirect_uri:  `${APP_URL}/zklogin/callback`,
    response_type: "id_token",
    scope:         "openid email profile",
    nonce,
  });

  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

export async function handleOAuthCallback(jwt: string): Promise<Record<string, unknown> | null> {
  try {
    const stored = getStoredSession();
    if (!stored) return null;

    const [, payloadB64] = jwt.split(".");
    const payload = JSON.parse(atob(payloadB64));
    const { sub, iss, email } = payload;

    const addrInput = new TextEncoder().encode(`${iss}:${sub}:trace-salt`);
    const addrHash  = new Uint8Array(await crypto.subtle.digest("SHA-256", addrInput));
    const address   = "0x" + uint8ToHex(addrHash).slice(0, 64);

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