import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useCallback } from "react";
import { Search, Filter, ExternalLink, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

const INTEGRITY_CONFIG = {
  0: { color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", label: "ORIGINAL" },
  1: { color: "text-amber-400",   bg: "bg-amber-500/10 border-amber-500/20",     label: "MODIFIED" },
  2: { color: "text-rose-500",    bg: "bg-rose-500/10 border-rose-500/20",        label: "UNVERIFIED" },
  3: { color: "text-violet-400",  bg: "bg-violet-500/10 border-violet-500/20",    label: "AI GENERATED" },
} as const;

const EDIT_LABELS: Record<number, string> = {
  0: "ORIGINAL", 1: "TRIM", 2: "COLOR GRADE", 3: "SUBTITLE",
  4: "AI REMIX",  5: "CROP", 6: "MERGE",       7: "TRANSLATE",
};

interface MediaEntry {
  mediaId: string;
  creator: string;
  timestamp: number;
  editType: number;
  integrity: number;
  aiScore: number;
  blobId: string;
  suiTx: string;
  description: string;
  revoked: boolean;
  parentId?: string;
}

interface ExplorerResponse {
  items: MediaEntry[];
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export function ExplorerPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<ExplorerResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [integrity, setIntegrity] = useState("");
  const [editType, setEditType] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("timestamp");
  const [order, setOrder] = useState("desc");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query)     params.set("q", query);
      if (integrity) params.set("integrity", integrity);
      if (editType)  params.set("edit_type", editType);
      params.set("page", String(page));
      params.set("sort", sort);
      params.set("order", order);
      params.set("limit", "15");

      const res = await fetch(`${API}/v1/explorer?${params}`);
      const json = await res.json();
      setData(json);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [query, integrity, editType, page, sort, order]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [query, integrity, editType]);

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-20">

        {/* Header */}
        <motion.div className="mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="mb-2 text-3xl sm:text-5xl font-bold text-white">
            Media{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Explorer
            </span>
          </h1>
          <p className="text-sm sm:text-base text-white/60">
            Browse all media registered on the TRACE protocol
          </p>
          {data && (
            <div className="mt-2 font-mono text-xs text-white/30">
              {data.total} records on-chain
            </div>
          )}
        </motion.div>

        {/* Filters */}
        <motion.div
          className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4 sm:p-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/30" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by ID, description, creator, hash..."
                className="w-full rounded-lg border border-white/10 bg-black pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
              />
            </div>

            {/* Integrity filter */}
            <select value={integrity} onChange={(e) => setIntegrity(e.target.value)}
              className="rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/30 cursor-pointer">
              <option value="">All Status</option>
              <option value="0">Verified Original</option>
              <option value="1">Modified</option>
              <option value="2">Unverified</option>
              <option value="3">AI Generated</option>
            </select>

            {/* Edit type filter */}
            <select value={editType} onChange={(e) => setEditType(e.target.value)}
              className="rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/30 cursor-pointer">
              <option value="">All Types</option>
              {Object.entries(EDIT_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>

            {/* Sort */}
            <select value={`${sort}-${order}`}
              onChange={(e) => { const [s, o] = e.target.value.split("-"); setSort(s); setOrder(o); }}
              className="rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/30 cursor-pointer">
              <option value="timestamp-desc">Newest First</option>
              <option value="timestamp-asc">Oldest First</option>
              <option value="aiScore-desc">Highest AI Score</option>
              <option value="aiScore-asc">Lowest AI Score</option>
            </select>

            <Button onClick={fetchData} variant="outline" size="icon"
              className="shrink-0 border-white/20 bg-white/5 text-white hover:bg-white/10">
              <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          className="rounded-xl border border-white/10 overflow-hidden"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>

          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-4 py-3 text-left font-mono text-xs text-white/40 tracking-widest">STATUS</th>
                  <th className="px-4 py-3 text-left font-mono text-xs text-white/40 tracking-widest">MEDIA ID</th>
                  <th className="px-4 py-3 text-left font-mono text-xs text-white/40 tracking-widest">DESCRIPTION</th>
                  <th className="px-4 py-3 text-left font-mono text-xs text-white/40 tracking-widest">TYPE</th>
                  <th className="px-4 py-3 text-left font-mono text-xs text-white/40 tracking-widest">AI SCORE</th>
                  <th className="px-4 py-3 text-left font-mono text-xs text-white/40 tracking-widest">TIMESTAMP</th>
                  <th className="px-4 py-3 text-left font-mono text-xs text-white/40 tracking-widest">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="border-b border-white/5">
                        {Array.from({ length: 7 }).map((_, j) => (
                          <td key={j} className="px-4 py-4">
                            <div className="h-3 rounded bg-white/5 animate-pulse" style={{ width: `${40 + Math.random() * 40}%` }} />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : data?.items.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-16 text-center text-white/30 font-mono text-sm">
                        No media found. Register your first file to get started.
                      </td>
                    </tr>
                  ) : (
                    data?.items.map((item, i) => {
                      const cfg = INTEGRITY_CONFIG[item.integrity as keyof typeof INTEGRITY_CONFIG] ?? INTEGRITY_CONFIG[2];
                      return (
                        <motion.tr key={item.mediaId}
                          initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
                          onClick={() => navigate(`/media/${item.mediaId}`)}>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1.5 rounded border px-2 py-0.5 font-mono text-[10px] ${cfg.bg} ${cfg.color}`}>
                              <span className={`size-1.5 rounded-full ${cfg.color.replace("text-", "bg-")}`} />
                              {cfg.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-white/60">
                            {item.mediaId.slice(0, 12)}...
                          </td>
                          <td className="px-4 py-3 text-sm text-white max-w-xs truncate">
                            {item.description || "—"}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-white/50">
                            {EDIT_LABELS[item.editType] ?? "—"}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs">
                            <span className={item.aiScore >= 7500 ? "text-violet-400" : item.aiScore >= 3000 ? "text-amber-400" : "text-emerald-400"}>
                              {(item.aiScore / 100).toFixed(1)}%
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-white/40">
                            {new Date(item.timestamp).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                              <button onClick={() => navigate(`/graph/${item.mediaId}`)}
                                className="text-xs text-white/40 hover:text-white transition-colors font-mono">
                                GRAPH
                              </button>
                              <button onClick={() => window.open(`${import.meta.env.VITE_API_URL ?? "http://localhost:3001"}/v1/media/${item.mediaId}/certificate`, "_blank")}
                                className="text-xs text-white/40 hover:text-white transition-colors font-mono">
                                CERT
                              </button>
                              <a href={`https://suiexplorer.com/txblock/${item.suiTx}?network=testnet`}
                                target="_blank" rel="noopener noreferrer"
                                className="text-xs text-white/40 hover:text-cyan-400 transition-colors">
                                <ExternalLink className="size-3" />
                              </a>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden divide-y divide-white/5">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 space-y-2">
                  <div className="h-3 w-24 rounded bg-white/5 animate-pulse" />
                  <div className="h-3 w-48 rounded bg-white/5 animate-pulse" />
                </div>
              ))
            ) : data?.items.length === 0 ? (
              <div className="p-8 text-center text-white/30 font-mono text-sm">No media found.</div>
            ) : (
              data?.items.map((item) => {
                const cfg = INTEGRITY_CONFIG[item.integrity as keyof typeof INTEGRITY_CONFIG] ?? INTEGRITY_CONFIG[2];
                return (
                  <div key={item.mediaId} className="p-4 hover:bg-white/5 cursor-pointer"
                    onClick={() => navigate(`/media/${item.mediaId}`)}>
                    <div className="flex items-start justify-between mb-2">
                      <span className={`font-mono text-[10px] ${cfg.color}`}>{cfg.label}</span>
                      <span className="text-xs text-white/30">{new Date(item.timestamp).toLocaleDateString()}</span>
                    </div>
                    <div className="text-sm text-white mb-1 truncate">{item.description || "Untitled"}</div>
                    <div className="font-mono text-[10px] text-white/30">{item.mediaId.slice(0, 20)}...</div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>

        {/* Pagination */}
        {data && data.pages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <span className="font-mono text-xs text-white/40">
              Page {data.page} of {data.pages} · {data.total} total
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1}
                className="border-white/20 bg-white/5 text-white hover:bg-white/10 disabled:opacity-30"
                onClick={() => setPage((p) => p - 1)}>
                <ChevronLeft className="size-4" />
              </Button>
              <Button variant="outline" size="sm" disabled={page >= data.pages}
                className="border-white/20 bg-white/5 text-white hover:bg-white/10 disabled:opacity-30"
                onClick={() => setPage((p) => p + 1)}>
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}