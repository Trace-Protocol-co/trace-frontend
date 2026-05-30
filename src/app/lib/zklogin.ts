/**
 * TRACE — zkLogin Integration
 * Wallet-free authentication using Google/Apple OAuth for journalists and creators.
 * Based on Sui's zkLogin spec: https://docs.sui.io/concepts/cryptography/zklogin
 */

// Import from the correct modern v2.x paths
import { SuiJsonRpcClient, getJsonRpcFullnodeUrl } from "@mysten/sui/jsonRpc";
import { generateNonce, generateRandomness } from "@mysten/sui/zklogin";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

// Instantiate the modern JsonRpcClient required by v2.x
const SUI_CLIENT = new SuiJsonRpcClient({ 
  url: getJsonRpcFullnodeUrl("testnet"),
  network: "testnet"
});

// Google OAuth client ID — replace with your actual client ID from Google Console
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";
const REDIRECT_URI = typeof window !== "undefined"
  ? `${window.location.origin}/zklogin/callback`
  : "http://localhost:5173/zklogin/callback";

export interface ZkLoginSession {
  address: string;
  email: string;
  provider: "google" | "apple";
  ephemeralKeypair: Ed25519Keypair;
  maxEpoch: number;
  randomness: string;
  jwt?: string;
}

// Store session in sessionStorage (cleared on tab close)
const SESSION_KEY = "trace_zklogin_session";

export function getStoredSession(): Partial<ZkLoginSession> | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

/**
 * Step 1: Generate ephemeral keypair and redirect to Google OAuth.
 * Call this when user clicks "Sign in with Google".
 */
export async function initiateGoogleLogin(): Promise<void> {
  // Call through the correct .core namespace for modern v2.x method calls
  const systemState = await SUI_CLIENT.core.getLatestSuiSystemState();
  const epoch = systemState.epoch;
  const maxEpoch   = Number(epoch) + 10; // valid for 10 epochs

  // Generate ephemeral keypair — lives only for this session
  const ephemeralKeypair = new Ed25519Keypair();
  const randomness       = generateRandomness();

  // Generate the verification nonce using the updated public key signature access
  const nonce = generateNonce(
    ephemeralKeypair.getPublicKey(),
    maxEpoch,
    randomness,
  );

  // Persist ephemeral data before redirect
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({
    maxEpoch,
    randomness,
    ephemeralPrivateKey: Buffer.from(ephemeralKeypair.getSecretKey()).toString("hex"),
  }));

  // Build Google OAuth URL
  const params = new URLSearchParams({
    client_id:     GOOGLE_CLIENT_ID,
    redirect_uri:  REDIRECT_URI,
    response_type: "id_token",
    scope:         "openid email profile",
    nonce,
  });

  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

/**
 * Step 2: Handle OAuth callback — extract JWT and compute Sui address.
 * Call this in your callback route component.
 */
export async function handleOAuthCallback(jwt: string): Promise<ZkLoginSession | null> {
  try {
    const stored = getStoredSession();
    if (!stored?.maxEpoch || !stored?.randomness || !stored?.ephemeralPrivateKey) {
      console.error("[zkLogin] No stored session found");
      return null;
    }

    const ephemeralKeypair = Ed25519Keypair.fromSecretKey(
      Buffer.from(stored.ephemeralPrivateKey as string, "hex")
    );

    // Decode JWT to get user info (without verification — server verifies)
    const jwtParts = jwt.split(".");
    if (jwtParts.length !== 3) throw new Error("Invalid JWT format");
    const payload = JSON.parse(atob(jwtParts[1]));

    const sub = payload.sub as string;
    const iss = payload.iss as string;
    const email = payload.email as string;

    // The address is derived from: hash(iss, sub, salt)
    const addressBytes = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(`${iss}:${sub}:trace-protocol-salt`)
    );
    const addressHex = "0x" + Array.from(new Uint8Array(addressBytes))
      .slice(0, 32)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    const session: ZkLoginSession = {
      address: addressHex,
      email,
      provider: "google",
      ephemeralKeypair,
      maxEpoch: stored.maxEpoch as number,
      randomness: stored.randomness as string,
      jwt,
    };

    // Update session storage with full session
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
      ...stored,
      address: addressHex,
      email,
      provider: "google",
      jwt,
    }));

    return session;
  } catch (err) {
    console.error("[zkLogin] Callback error:", err);
    return null;
  }
}

/**
 * Returns true if the user has an active zkLogin session.
 */
export function isAuthenticated(): boolean {
  const session = getStoredSession();
  return !!(session?.address && session?.jwt);
}

/**
 * Get the current user's Sui address from zkLogin session.
 */
export function getZkLoginAddress(): string | null {
  return getStoredSession()?.address as string ?? null;
}

/**
 * Get the current user's email.
 */
export function getZkLoginEmail(): string | null {
  return getStoredSession()?.email as string ?? null;
}
