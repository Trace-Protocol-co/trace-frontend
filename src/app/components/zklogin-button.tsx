/**
 * TRACE — zkLogin Button Component
 * Drop-in component for wallet-free Google sign-in.
 * Usage: <ZkLoginButton onLogin={(session) => ...} />
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  initiateGoogleLogin,
  isAuthenticated,
  getZkLoginAddress,
  getZkLoginEmail,
  clearSession,
} from "../lib/zklogin";

interface ZkLoginButtonProps {
  onLogin?: (address: string, email: string) => void;
  onLogout?: () => void;
  className?: string;
}

export function ZkLoginButton({ onLogin, onLogout, className = "" }: ZkLoginButtonProps) {
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    function checkAuth() {
      if (isAuthenticated()) {
        setAuthenticated(true);
        setAddress(getZkLoginAddress());
        setEmail(getZkLoginEmail());
      } else {
        setAuthenticated(false);
        setAddress(null);
        setEmail(null);
      }
    }

    // Check on mount
    checkAuth();

    // Re-check when window gets focus (after OAuth callback redirect)
    window.addEventListener("focus", checkAuth);
    // Re-check on storage changes (sessionStorage doesn't fire storage events
    // within the same tab, so we poll lightly after navigation)
    const interval = setInterval(checkAuth, 500);
    // Stop polling after 5 seconds
    const timeout = setTimeout(() => clearInterval(interval), 5000);

    return () => {
      window.removeEventListener("focus", checkAuth);
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await initiateGoogleLogin();
      // Page redirects to Google — execution stops here
    } catch (err) {
      console.error("[zkLogin] Login error:", err);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearSession();
    setAuthenticated(false);
    setAddress(null);
    setEmail(null);
    setShowDropdown(false);
    onLogout?.();
  };

  if (authenticated && address) {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setShowDropdown((v) => !v)}
          className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400 hover:bg-emerald-500/20 transition-all"
        >
          <div className="size-2 rounded-full bg-emerald-400" />
          <span className="font-mono text-xs">{email?.split("@")[0] ?? address.slice(0, 8) + "..."}</span>
        </button>

        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              className="absolute right-0 top-10 z-50 w-64 rounded-xl border border-white/10 bg-zinc-950 p-4 shadow-2xl"
            >
              <div className="mb-3 border-b border-white/10 pb-3">
                <div className="text-xs text-white/40 mb-1">Signed in as</div>
                <div className="text-sm text-white font-medium">{email}</div>
                <div className="font-mono text-[10px] text-white/30 mt-1 break-all">{address}</div>
              </div>
              <div className="mb-3 rounded-lg border border-white/5 bg-white/5 p-3">
                <div className="text-[10px] text-white/40 mb-1 font-mono">AUTHENTICATION METHOD</div>
                <div className="flex items-center gap-2 text-xs text-white">
                  <GoogleIcon />
                  zkLogin via Google OAuth
                </div>
                <div className="text-[10px] text-emerald-400 mt-1">No wallet required ✓</div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full rounded-lg border border-white/10 bg-white/5 py-2 text-xs text-white/60 hover:bg-white/10 hover:text-white transition-all"
              >
                Sign Out
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <button
      onClick={handleLogin}
      disabled={loading}
      className={`flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10 transition-all disabled:opacity-50 ${className}`}
    >
      {loading ? (
        <div className="size-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      ) : (
        <GoogleIcon />
      )}
      <span>{loading ? "Redirecting..." : "Sign in with Google"}</span>
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}