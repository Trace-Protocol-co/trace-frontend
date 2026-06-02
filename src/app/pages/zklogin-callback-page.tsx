/**
 * TRACE — zkLogin Callback Page
 * Handles the redirect from Google OAuth, extracts the JWT,
 * completes the zkLogin flow, and redirects to upload.
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { handleOAuthCallback } from "../lib/zklogin";

export function ZkLoginCallbackPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [error, setError] = useState("");

  useEffect(() => {
    async function processCallback() {
      try {
        // Google returns the id_token in the URL hash fragment
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.startsWith("#") ? hash.slice(1) : hash);
        const jwt = params.get("id_token");

        if (!jwt) {
          // Also check query params
          const queryParams = new URLSearchParams(window.location.search);
          const queryJwt = queryParams.get("id_token");
          if (!queryJwt) {
            setError("No id_token found in callback URL");
            setStatus("error");
            return;
          }
        }

        const token = jwt || new URLSearchParams(window.location.hash.slice(1)).get("id_token")!;
        const session = await handleOAuthCallback(token);

        if (session) {
          setStatus("success");
          // Small delay to show success state, then redirect to upload
          setTimeout(() => navigate("/upload"), 1200);
        } else {
          setError("Failed to process authentication");
          setStatus("error");
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Authentication failed");
        setStatus("error");
      }
    }

    processCallback();
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="text-center space-y-4">
        {status === "processing" && (
          <>
            <div className="mx-auto size-12 animate-spin rounded-full border-4 border-white/10 border-t-emerald-500" />
            <div className="font-mono text-sm text-white/60 tracking-widest">COMPLETING SIGN IN...</div>
            <div className="font-mono text-xs text-white/30">Verifying identity with Sui zkLogin</div>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/40">
              <span className="text-emerald-400 text-xl">✓</span>
            </div>
            <div className="font-mono text-sm text-emerald-400 tracking-widest">AUTHENTICATED</div>
            <div className="font-mono text-xs text-white/30">Redirecting to upload...</div>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-500/20 border border-red-500/40">
              <span className="text-red-400 text-xl">✕</span>
            </div>
            <div className="font-mono text-sm text-red-400 tracking-widest">AUTHENTICATION FAILED</div>
            <div className="font-mono text-xs text-white/40 max-w-xs">{error}</div>
            <button
              onClick={() => navigate("/")}
              className="mt-4 font-mono text-xs text-white/40 hover:text-white underline"
            >
              Return home
            </button>
          </>
        )}
      </div>
    </div>
  );
}