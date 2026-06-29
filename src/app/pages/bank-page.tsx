import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Database, AlertTriangle, TrendingUp, Shield, RefreshCw, ExternalLink, Search, Eye } from "lucide-react";
import { Button } from "../components/ui/button";

const API    = import.meta.env.VITE_API_URL ?? "http://localhost:3001";
const WALRUS = "https://aggregator.walrus-testnet.walrus.space/v1";

interface BankStats {
  total_sightings:    number;
  total_verified:     number;
  total_unverified:   number;
  total_ai_generated: number;
  unique_media:       number;
  active_alerts:      number;
  sessions_run:       number;
  walrus_memory:      string | null;
  walrus_explorer:    string | null;
  memwal_enabled:     boolean;
  last_updated:       string | null;
  memwal_blobs:       number;
  first_sighting:     string | null;
}

interface TopSighted {
  hash:           string;
  verdict:        string;
  sighting_count: number;
  first_seen:     string;
  sources:        string[];
}

interface Alert {
  hash:    string;
  sources: string[];
  count:   number;
}

interface ResearchReport {
  dataset:              { total_bank_sightings: number; total_registered_media: number; total_sessions: number; active_anomaly_alerts: number; memwal_blobs_on_walrus?: number };
  verdict_distribution: Record<string, number>;
  integrity_rate:       string;
  ai_generation_rate:   string;
  walrus_memory_blob:   string | null;
  walrus_explorer:      string | null;
}

const VERDICT_COLOR: Record<string, string> = {
  VERIFIED_ORIGINAL: "text-emerald-400",
  MODIFIED:          "text-amber-400",
  UNVERIFIED:        "text-rose-400",
  AI_GENERATED:      "text-violet-400",
  UNKNOWN:           "text-zinc-400",
};

const VERDICT_LABEL: Record<string, string> = {
  VERIFIED_ORIGINAL: "Verified Original",
  MODIFIED:          "Modified",
  UNVERIFIED:        "Unverified",
  AI_GENERATED:      "AI Generated",
  UNKNOWN:           "Unknown",
};

export function BankPage() {
  const [stats,     setStats]     = useState<BankStats | null>(null);
  const [top,       setTop]       = useState<TopSighted[]>([]);
  const [alerts,    setAlerts]    = useState<Alert[]>([]);
  const [research,  setResearch]  = useState<ResearchReport | null>(null);
  const [recall,    setRecall]    = useState<{ text: string; blob_id: string; distance: number }[]>([]);
  const [query,     setQuery]     = useState("verified media on BBC");
  const [loading,   setLoading]   = useState(true);
  const [recalling, setRecalling] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [s, t, a, r] = await Promise.all([
        fetch(`${API}/v1/bank/stats`).then(r => r.json()),
        fetch(`${API}/v1/bank/top-sighted`).then(r => r.json()),
        fetch(`${API}/v1/bank/alerts`).then(r => r.json()),
        fetch(`${API}/agent/research`).then(r => r.json()),
      ]);
      setStats(s);
      setTop(t.results ?? []);
      setAlerts(a.repeated_fakes ?? []);
      setResearch(r);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  const doRecall = async () => {
    setRecalling(true);
    try {
      const r = await fetch(`${API}/agent/recall?q=${encodeURIComponent(query)}&limit=5`);
      const d = await r.json();
      setRecall(d.results ?? []);
    } catch { /* ignore */ }
    finally { setRecalling(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const unverified = stats ? stats.total_sightings - stats.total_verified : 0;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24">

        {/* Header */}
        <motion.div className="mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-xs text-blue-400">
            <div className="size-2 rounded-full bg-blue-400 animate-pulse" />
            Collective Memory Bank — Live
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">Memory Bank</h1>
          <p className="text-white/60 max-w-2xl">
            A persistent, decentralized record of every media file encountered by every TRACE agent.
            Stored in MemWal on Walrus. Never forgets. Grows with every page browse.
          </p>
        </motion.div>

        {/* Stats grid */}
        <motion.div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          {[
            {
              label: "Media Encountered",
              sub:   "Across all sites · growing",
              value: stats?.total_sightings ?? 0,
              color: "text-white",
              icon:  Eye,
            },
            {
              label: "Cryptographically Proven",
              sub:   "On Sui blockchain · tamper-proof",
              value: stats?.total_verified ?? 0,
              color: "text-emerald-400",
              icon:  Shield,
            },
            {
              label: "Suspicious Patterns",
              sub:   "Coordinated fakes detected",
              value: stats?.active_alerts ?? 0,
              color: "text-rose-400",
              icon:  AlertTriangle,
            },
            {
              label: "Registered on TRACE",
              sub:   "With Walrus blob + certificate",
              value: stats?.unique_media ?? 0,
              color: "text-blue-400",
              icon:  TrendingUp,
            },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-white/40 uppercase tracking-wider leading-tight">{s.label}</span>
                <s.icon className={`size-4 ${s.color} opacity-60 shrink-0 ml-2`} />
              </div>
              <div className={`text-3xl font-bold ${s.color}`}>{s.value.toLocaleString()}</div>
              <div className="text-xs text-white/30 mt-1">{s.sub}</div>
            </div>
          ))}
        </motion.div>

        {/* The gap story */}
        {stats && stats.total_sightings > 0 && (
          <motion.div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-5 text-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
            <p className="text-white/60 text-sm">
              <span className="text-white font-bold">{stats.total_sightings.toLocaleString()}</span> media files encountered · {" "}
              <span className="text-emerald-400 font-bold">{stats.total_verified.toLocaleString()}</span> cryptographically proven · {" "}
              <span className="text-rose-400 font-bold">{unverified.toLocaleString()}</span> unverified
              <span className="text-white/40"> — this is why TRACE exists</span>
            </p>
            {stats.first_sighting && (
              <p className="text-white/30 text-xs mt-1">
                First sighting: {new Date(stats.first_sighting).toLocaleDateString()} · 
                Last updated: {stats.last_updated ? new Date(stats.last_updated).toLocaleTimeString() : "—"}
              </p>
            )}
          </motion.div>
        )}

        {/* Walrus memory link */}
        {(stats?.walrus_explorer || stats?.walrus_memory) && (
          <motion.div className="mb-8 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="size-2 rounded-full bg-blue-400 animate-pulse" />
                  <div className="text-xs text-blue-400 font-semibold">WALRUS PERSISTENT MEMORY · {stats?.memwal_blobs ?? 0} blobs stored</div>
                </div>
                <div className="font-mono text-xs text-white/60 truncate max-w-lg">
                  {stats?.walrus_explorer ?? stats?.walrus_memory}
                </div>
              </div>
              <a href={stats?.walrus_explorer ?? stats?.walrus_memory ?? "#"}
                target="_blank" rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 shrink-0 ml-4">
                <ExternalLink className="size-4" />
              </a>
            </div>
          </motion.div>
        )}

        <div className="grid gap-6 lg:grid-cols-2 mb-8">

          {/* Anomaly Feed */}
          <motion.div className="rounded-2xl border border-white/10 bg-white/5 p-6"
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className="flex items-center gap-3 mb-5">
              <AlertTriangle className="size-5 text-rose-400" />
              <h2 className="font-semibold">Anomaly Feed</h2>
              {alerts.length > 0 && (
                <span className="ml-auto text-xs bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-full">
                  {alerts.length} active
                </span>
              )}
            </div>
            {alerts.length === 0 ? (
              <div className="text-sm text-white/40 py-8 text-center">
                <AlertTriangle className="size-8 mx-auto mb-3 opacity-20" />
                No coordinated inauthentic behavior detected
              </div>
            ) : (
              <div className="space-y-3">
                {alerts.map((a, i) => (
                  <div key={i} className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="size-2 rounded-full bg-rose-400 animate-pulse" />
                      <span className="text-xs font-semibold text-rose-400">COORDINATED SPREAD DETECTED</span>
                    </div>
                    <div className="font-mono text-xs text-white/50 mb-2 truncate">{a.hash}</div>
                    <div className="text-xs text-white/40">
                      Seen {a.count}× across {a.sources.length} sources: {a.sources.join(", ")}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Top Sighted Media */}
          <motion.div className="rounded-2xl border border-white/10 bg-white/5 p-6"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
            <div className="flex items-center gap-3 mb-5">
              <TrendingUp className="size-5 text-blue-400" />
              <h2 className="font-semibold">Most Encountered Media</h2>
            </div>
            {top.length === 0 ? (
              <div className="text-sm text-white/40 py-8 text-center">
                <Database className="size-8 mx-auto mb-3 opacity-20" />
                Browse any page with the extension to populate
              </div>
            ) : (
              <div className="space-y-2">
                {top.slice(0, 8).map((item, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg border border-white/5 bg-black/30 px-3 py-2">
                    <span className="text-xs text-white/30 w-4 shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-xs text-white/60 truncate">{item.hash}</div>
                      <div className="text-xs text-white/30 truncate">{item.sources?.slice(0,3).join(", ")}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className={`text-xs font-semibold ${VERDICT_COLOR[item.verdict] ?? "text-zinc-400"}`}>
                        {VERDICT_LABEL[item.verdict] ?? item.verdict}
                      </div>
                      <div className="text-xs text-white/30">{item.sighting_count.toLocaleString()}×</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* MemWal Semantic Recall */}
        <motion.div className="mb-8 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center gap-3 mb-4">
            <Search className="size-5 text-violet-400" />
            <h2 className="font-semibold">Semantic Memory Search</h2>
            <span className="text-xs border border-violet-400/30 text-violet-400 rounded-full px-2 py-0.5">MemWal</span>
          </div>
          <p className="text-sm text-white/50 mb-4">
            Search the bank by meaning — not keywords. Ask anything about what the bank has seen.
          </p>
          <div className="flex gap-3 mb-4">
            <input value={query} onChange={e => setQuery(e.target.value)}
              placeholder="e.g. verified media from BBC"
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50" />
            <Button onClick={doRecall} disabled={recalling}
              className="bg-violet-600 hover:bg-violet-500 text-white shrink-0">
              {recalling ? "Recalling..." : "Recall"}
            </Button>
          </div>
          {recall.length > 0 ? (
            <div className="space-y-2">
              {recall.map((r, i) => (
                <div key={i} className="rounded-lg border border-white/10 bg-black/40 p-3">
                  <p className="text-xs text-white/70 leading-relaxed mb-2">{r.text}</p>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] text-violet-400">blob: {r.blob_id?.slice(0, 20)}...</span>
                    <span className="text-[10px] text-white/30">relevance: {(1 - r.distance).toFixed(2)}</span>
                    <a href={`https://walruscan.com/testnet/blob/${r.blob_id}`}
                      target="_blank" rel="noopener noreferrer"
                      className="ml-auto text-violet-400/50 hover:text-violet-400 text-[10px]">
                      Walruscan ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-white/30">
              {stats?.memwal_enabled
                ? "Enter a query and click Recall to search semantic memory"
                : "MemWal not configured — add MEMWAL_PRIVATE_KEY to enable"}
            </p>
          )}
        </motion.div>

        {/* Research Report */}
        {research && (
          <motion.div className="rounded-2xl border border-white/10 bg-white/5 p-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-semibold">Research Agent Report</h2>
                <p className="text-xs text-white/40 mt-0.5">Aggregate intelligence from the Collective Memory Bank</p>
              </div>
              <Button variant="outline" size="sm"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={fetchAll}>
                <RefreshCw className="size-3 mr-2" />Refresh
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3 mb-4">
              <div className="rounded-xl bg-black/40 p-4 text-center">
                <div className="text-2xl font-bold text-white">{research.integrity_rate}</div>
                <div className="text-xs text-white/40 mt-1">Integrity Rate</div>
                <div className="text-xs text-white/20 mt-0.5">Verified / total sightings</div>
              </div>
              <div className="rounded-xl bg-black/40 p-4 text-center">
                <div className="text-2xl font-bold text-violet-400">{research.ai_generation_rate}</div>
                <div className="text-xs text-white/40 mt-1">AI Generation Rate</div>
                <div className="text-xs text-white/20 mt-0.5">Flagged as synthetic</div>
              </div>
              <div className="rounded-xl bg-black/40 p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">{research.dataset.memwal_blobs_on_walrus ?? 0}</div>
                <div className="text-xs text-white/40 mt-1">Walrus Blobs</div>
                <div className="text-xs text-white/20 mt-0.5">Permanently stored</div>
              </div>
            </div>
            {Object.keys(research.verdict_distribution).length > 0 && (
              <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                <div className="text-xs text-white/40 mb-3 uppercase tracking-wider">Verdict Distribution</div>
                <div className="space-y-2">
                  {Object.entries(research.verdict_distribution)
                    .sort(([,a], [,b]) => b - a)
                    .map(([verdict, count]) => {
                      const total = Object.values(research.verdict_distribution).reduce((a, b) => a + b, 0);
                      const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                      return (
                        <div key={verdict} className="flex items-center gap-3">
                          <span className={`text-xs w-40 shrink-0 ${VERDICT_COLOR[verdict] ?? "text-zinc-400"}`}>
                            {VERDICT_LABEL[verdict] ?? verdict}
                          </span>
                          <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div className="h-full rounded-full bg-white/30 transition-all duration-500" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-white/40 w-12 text-right">{count.toLocaleString()}</span>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
            {(research.walrus_explorer || research.walrus_memory_blob) && (
              <div className="mt-4 flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-blue-400" />
                <span className="text-xs text-white/30">Archived on Walrus: </span>
                <a href={research.walrus_explorer ?? `${WALRUS}/${research.walrus_memory_blob}`}
                  target="_blank" rel="noopener noreferrer"
                  className="text-xs text-blue-400/70 hover:text-blue-400 font-mono truncate">
                  {(research.walrus_memory_blob ?? "").slice(0, 24)}...
                </a>
              </div>
            )}
          </motion.div>
        )}

      </div>
    </div>
  );
}