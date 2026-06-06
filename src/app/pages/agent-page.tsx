import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Bot, Activity, Shield, AlertTriangle, CheckCircle2, Database, ExternalLink, RefreshCw } from "lucide-react";
import { Button } from "../components/ui/button";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";
const WALRUS_AGG = "https://aggregator.walrus-testnet.walrus.space";

interface AgentStatus {
  status: string;
  total_scanned: number;
  total_verified: number;
  total_flagged: number;
  walrus_memory: string | null;
  last_session: { started: string; ended?: string; scanned: number; flagged: number } | null;
  sessions_count: number;
}

export function AgentPage() {
  const [status, setStatus] = useState<AgentStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifyUrl, setVerifyUrl] = useState("");
  const [verifyResult, setVerifyResult] = useState<{ verdict: string; confidence: number } | null>(null);
  const [verifying, setVerifying] = useState(false);

  const fetchStatus = async () => {
    try {
      const res  = await fetch(API_URL + "/agent/status");
      const data = await res.json();
      setStatus(data);
    } catch {
      setStatus(null);
    } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const verifyImage = async () => {
    if (!verifyUrl.trim()) return;
    setVerifying(true); setVerifyResult(null);
    try {
      const res  = await fetch(API_URL + "/agent/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_url: verifyUrl, source: "manual" }),
      });
      const data = await res.json();
      setVerifyResult(data);
    } catch { setVerifyResult({ verdict: "ERROR", confidence: 0 }); }
    finally { setVerifying(false); }
  };

  const verdictConfig: Record<string, { color: string; icon: React.ElementType; label: string }> = {
    VERIFIED_ORIGINAL: { color: "text-emerald-400", icon: CheckCircle2, label: "Verified Original" },
    MODIFIED:          { color: "text-amber-400",   icon: AlertTriangle, label: "Modified" },
    UNVERIFIED:        { color: "text-rose-400",    icon: AlertTriangle, label: "Unverified" },
    AI_GENERATED:      { color: "text-violet-400",  icon: Bot,           label: "AI Generated" },
    UNKNOWN:           { color: "text-zinc-400",    icon: Activity,      label: "Unknown" },
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-16 sm:py-24">

        {/* Header */}
        <motion.div className="mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-400">
            <div className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            Autonomous Agent — Running
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">TRACE Verification Agent</h1>
          <p className="text-white/60 max-w-2xl text-lg">
            An autonomous AI agent that continuously monitors media sources,
            verifies authenticity against the TRACE registry, and stores its
            growing memory permanently on <span className="text-blue-400">Walrus</span> —
            persistent across sessions, queryable by any other agent.
          </p>
        </motion.div>

        {/* How it works */}
        <motion.div className="mb-10 grid gap-4 sm:grid-cols-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          {[
            { icon: Activity,   step: "01", title: "Monitor",  desc: "Scans news sources for new media every 5 minutes" },
            { icon: Shield,     step: "02", title: "Verify",   desc: "Calls TRACE API to verify each image cryptographically" },
            { icon: Database,   step: "03", title: "Remember", desc: "Stores memory of every seen image on Walrus permanently" },
            { icon: Bot,        step: "04", title: "Share",    desc: "Any agent reads memory via Walrus blob ID" },
          ].map((item) => (
            <div key={item.step} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs text-white/30">{item.step}</span>
                <item.icon className="size-4 text-emerald-500" />
              </div>
              <div className="font-semibold text-sm mb-1">{item.title}</div>
              <div className="text-xs text-white/50">{item.desc}</div>
            </div>
          ))}
        </motion.div>

        {/* Live Status */}
        <motion.div className="mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-lg">Live Agent Status</h2>
              <Button variant="outline" size="sm"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={fetchStatus}>
                <RefreshCw className="size-3 mr-2" />Refresh
              </Button>
            </div>

            {loading ? (
              <div className="text-white/40 text-sm">Loading agent status...</div>
            ) : !status || status.status === "offline" ? (
              <div className="space-y-3">
                <div className="text-amber-400 text-sm font-medium">
                  Agent scanning paused — memory preserved on Walrus
                </div>
                <div className="text-white/40 text-xs">
                  The agent runs on the backend server. Start it with:
                  <code className="ml-2 bg-white/10 px-2 py-0.5 rounded text-white/70">npm run agent</code>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Total Scanned",   value: status.total_scanned,  color: "text-white" },
                  { label: "Verified",         value: status.total_verified, color: "text-emerald-400" },
                  { label: "Flagged",          value: status.total_flagged,  color: "text-rose-400" },
                  { label: "Sessions Run",     value: status.sessions_count, color: "text-blue-400" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-white/10 bg-black/50 p-4 text-center">
                    <div className={`text-3xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
                    <div className="text-xs text-white/40">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Walrus Memory */}
        {status?.walrus_memory && (
          <motion.div className="mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Database className="size-5 text-blue-400" />
                <h2 className="font-semibold">Walrus Persistent Memory</h2>
              </div>
              <p className="text-sm text-white/60 mb-4">
                The agent's complete memory — every image ever scanned, every verdict,
                every pattern detected — is stored permanently on Walrus. Any AI agent
                anywhere can load this memory and continue where this agent left off.
              </p>
              <div className="rounded-lg bg-black/50 border border-white/10 p-4">
                <div className="text-xs text-white/40 mb-2">Walrus Blob URL (agent memory)</div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-blue-400 break-all">{status.walrus_memory}</span>
                  <a href={status.walrus_memory} target="_blank" rel="noopener noreferrer"
                    className="shrink-0">
                    <ExternalLink className="size-4 text-white/30 hover:text-blue-400" />
                  </a>
                </div>
              </div>
              <div className="mt-4 text-xs text-white/30 font-mono">
                # Any agent can load TRACE memory:
                <br />
                curl {status.walrus_memory}
              </div>
            </div>
          </motion.div>
        )}

        {/* Try It — Verify Any Image URL */}
        <motion.div className="mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="font-semibold mb-2">Ask the Agent to Verify Any Image</h2>
            <p className="text-sm text-white/50 mb-5">
              Paste any image URL — the agent verifies it, stores the result in Walrus memory,
              and returns the verdict.
            </p>
            <div className="flex gap-3">
              <input value={verifyUrl} onChange={e => setVerifyUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30" />
              <Button onClick={verifyImage} disabled={!verifyUrl.trim() || verifying}
                className="bg-white text-black hover:bg-white/90 font-semibold shrink-0">
                {verifying ? "Verifying..." : "Verify"}
              </Button>
            </div>

            {verifyResult && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-xl border border-white/10 bg-black/50 p-4">
                {(() => {
                  const cfg = verdictConfig[verifyResult.verdict] ?? verdictConfig.UNKNOWN;
                  const Icon = cfg.icon;
                  return (
                    <div className="flex items-center gap-3">
                      <Icon className={`size-6 ${cfg.color}`} />
                      <div>
                        <div className={`font-bold ${cfg.color}`}>{cfg.label}</div>
                        <div className="text-xs text-white/40">
                          {(verifyResult.confidence * 100).toFixed(0)}% confidence ·
                          Result stored in Walrus agent memory
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* API Reference */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="font-semibold mb-4">Agent API — Queryable by Any Agent</h2>
            <div className="space-y-3">
              {[
                { method: "GET",  path: "/agent/status",  desc: "Current agent state and Walrus memory blob ID" },
                { method: "GET",  path: "/agent/memory",  desc: "Full agent memory (all seen images + verdicts)" },
                { method: "POST", path: "/agent/verify",  desc: "Ask agent to verify an image URL" },
                { method: "GET",  path: "/agent/flagged", desc: "Patterns: repeated fakes, suspicious sources" },
              ].map((ep) => (
                <div key={ep.path} className="flex items-start gap-3 text-sm">
                  <span className={`shrink-0 rounded px-2 py-0.5 font-mono text-xs font-bold ${
                    ep.method === "GET" ? "bg-sky-500/20 text-sky-400" : "bg-emerald-500/20 text-emerald-400"
                  }`}>{ep.method}</span>
                  <code className="text-white/70 font-mono text-xs">{API_URL}{ep.path}</code>
                  <span className="text-white/40 text-xs">{ep.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}