import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useCallback } from "react";
import { ExternalLink, Clock, User, Activity, XCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { fetchGraph, type GraphNode, type GraphData } from "../lib/api";

const STATUS_CONFIG = {
  0: { color: "bg-emerald-500", border: "border-emerald-500", text: "text-emerald-500", label: "VERIFIED ORIGINAL", glow: "rgba(52,211,153,0.3)" },
  1: { color: "bg-amber-500",   border: "border-amber-500",   text: "text-amber-500",   label: "MODIFIED",         glow: "rgba(251,191,36,0.3)"  },
  2: { color: "bg-red-500",     border: "border-red-500",     text: "text-red-500",     label: "UNVERIFIED",       glow: "rgba(244,63,94,0.3)"   },
  3: { color: "bg-violet-500",  border: "border-violet-500",  text: "text-violet-500",  label: "AI GENERATED",     glow: "rgba(167,139,250,0.3)" },
} as const;

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className="font-mono text-[10px] text-white/30 hover:text-white/60 transition-colors shrink-0">
      {copied ? "✓" : "COPY"}
    </button>
  );
}

function NodeCard({ node, isSelected, onClick }: { node: GraphNode; isSelected: boolean; onClick: () => void }) {
  const integrity = (node.integrity ?? 2) as 0 | 1 | 2 | 3;
  const cfg = STATUS_CONFIG[integrity];

  return (
    <motion.div
      className={`relative min-w-44 cursor-pointer rounded-xl border-2 ${cfg.border} bg-black p-4 shadow-2xl transition-all`}
      style={{ boxShadow: isSelected ? `0 0 24px ${cfg.glow}` : undefined }}
      onClick={onClick}
      whileHover={{ scale: 1.04, boxShadow: `0 0 20px ${cfg.glow}` }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="mb-3 flex items-center justify-between">
        <Badge className={`${cfg.color} border-0 text-xs text-white`}>
          {cfg.label}
        </Badge>
        <motion.div
          className={`size-3 rounded-full ${cfg.color}`}
          animate={{ opacity: [1, 0.3, 1], scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
      <div className="mb-1 text-sm font-bold text-white">
        NODE_{String.fromCharCode(65 + 0)}
      </div>
      <div className="font-mono text-xs text-white/40 truncate">{node.mediaId.slice(0, 20)}…</div>
      {node.revoked && (
        <div className="mt-2 text-xs text-red-400 font-mono">REVOKED</div>
      )}
    </motion.div>
  );
}

export function ProvenanceGraphPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [graph, setGraph] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<GraphNode | null>(null);
  const [manualId, setManualId] = useState(id ?? "");

  const loadGraph = useCallback(async (mediaId: string) => {
    if (!mediaId.trim()) return;
    setLoading(true);
    setError("");
    setSelected(null);
    try {
      const data = await fetchGraph(mediaId.trim());
      setGraph(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load graph");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) loadGraph(id);
  }, [id, loadGraph]);

  // SVG layout: horizontal chain
  const nodeW = 180;
  const nodeH = 80;
  const hGap = 100;
  const nodes = graph?.nodes ?? [];
  const edges = graph?.edges ?? [];
  const svgW = Math.max(700, nodes.length * (nodeW + hGap) + 80);
  const svgH = 200;

  const positions: Record<string, { x: number; y: number }> = {};
  nodes.forEach((n, i) => {
    positions[n.mediaId] = { x: 40 + i * (nodeW + hGap), y: svgH / 2 - nodeH / 2 };
  });

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-4xl font-bold text-white">Provenance Graph</h1>
              <p className="text-white/60 font-mono text-sm">
                Media ID: <span className="text-white">{id ?? "—"}</span>
              </p>
            </div>
            <Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10"
              onClick={() => { if (graph) { /* export SVG */ } }}>
              <ExternalLink className="mr-2 size-4" />
              Export Graph
            </Button>
          </div>

          {/* Search bar */}
          <div className="flex gap-3">
            <input
              type="text" value={manualId} onChange={(e) => setManualId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && loadGraph(manualId)}
              placeholder="Enter Media ID (0x...)"
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 font-mono text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
            />
            <Button onClick={() => loadGraph(manualId)} disabled={loading}
              className="bg-white text-black hover:bg-white/90 px-6">
              {loading ? "Loading..." : "Query"}
            </Button>
          </div>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/5 px-5 py-4 font-mono text-sm text-red-400">
              <XCircle className="size-4 shrink-0" />
              <span className="flex-1">{error}</span>
              <button onClick={() => setError("")} className="text-red-600 hover:text-red-400">✕</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Graph canvas */}
        <motion.div
          className="overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {loading && (
            <div className="flex h-64 items-center justify-center">
              <motion.div className="size-16 rounded-full border-4 border-cyan-500/20 border-t-cyan-500"
                animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
            </div>
          )}

          {!loading && nodes.length === 0 && !error && (
            <div className="flex h-64 flex-col items-center justify-center gap-3 text-white/40">
              <Activity className="size-12" />
              <p className="font-mono text-sm">Enter a Media ID to visualize its provenance chain</p>
            </div>
          )}

          {!loading && nodes.length > 0 && (
            <div className="p-8">
              {/* Click hint */}
              <div className="mb-4 flex items-center gap-2 text-xs text-white/30 font-mono">
                <span className="size-2 rounded-full bg-emerald-500/50 inline-block" />
                Click any node to inspect its provenance details
              </div>

              {/* SVG Graph */}
              <div className="overflow-x-auto">
                <svg width={svgW} height={svgH}>
                  {/* Grid dots */}
                  <defs>
                    <pattern id="dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
                      <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.05)" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#dots)" />

                  {/* Edges */}
                  {edges.map((edge, i) => {
                    const from = positions[edge.from];
                    const to = positions[edge.to];
                    if (!from || !to) return null;
                    return (
                      <g key={i}>
                        <motion.line
                          x1={from.x + nodeW} y1={from.y + nodeH / 2}
                          x2={to.x} y2={to.y + nodeH / 2}
                          stroke="rgba(255,255,255,0.15)" strokeWidth={2}
                          strokeDasharray={edge.type === "AUTO_DETECTED" ? "6,4" : "none"}
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 1 }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                        />
                        {/* Arrow */}
                        <polygon
                          points={`${to.x},${to.y + nodeH / 2} ${to.x - 10},${to.y + nodeH / 2 - 5} ${to.x - 10},${to.y + nodeH / 2 + 5}`}
                          fill="rgba(255,255,255,0.15)"
                        />
                      </g>
                    );
                  })}

                  {/* Nodes as foreignObject */}
                  {nodes.map((node, i) => {
                    const pos = positions[node.mediaId];
                    const integrity = (node.integrity ?? 2) as 0 | 1 | 2 | 3;
                    const cfg = STATUS_CONFIG[integrity];
                    const isSelected = selected?.mediaId === node.mediaId;

                    return (
                      <motion.g
                        key={node.mediaId}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.12, type: "spring", stiffness: 200 }}
                        onClick={() => setSelected(isSelected ? null : node)}
                        style={{ cursor: "pointer" }}
                      >
                        {/* Glow ring */}
                        {isSelected && (
                          <rect x={pos.x - 4} y={pos.y - 4} width={nodeW + 8} height={nodeH + 8} rx={14}
                            fill="none" stroke={cfg.glow} strokeWidth={2} />
                        )}
                        {/* Node box */}
                        <rect x={pos.x} y={pos.y} width={nodeW} height={nodeH} rx={12}
                          fill="#0a0a0a" stroke={isSelected ? cfg.glow : "rgba(255,255,255,0.1)"} strokeWidth={isSelected ? 2 : 1} />
                        {/* Status bar */}
                        <rect x={pos.x} y={pos.y} width={4} height={nodeH} rx={2} fill={cfg.glow.replace("0.3", "0.8")} />
                        {/* Label */}
                        <text x={pos.x + 16} y={pos.y + 24} fill={cfg.glow.replace("0.3", "0.9")} fontSize={9} letterSpacing={2} fontFamily="monospace">
                          {cfg.label}
                        </text>
                        <text x={pos.x + 16} y={pos.y + 42} fill="rgba(255,255,255,0.5)" fontSize={10} fontFamily="monospace">
                          NODE_{String.fromCharCode(65 + i)}
                        </text>
                        <text x={pos.x + 16} y={pos.y + 58} fill="rgba(255,255,255,0.25)" fontSize={9} fontFamily="monospace">
                          {node.mediaId.slice(0, 16)}…
                        </text>
                        {/* Pulse dot */}
                        <circle cx={pos.x + nodeW - 16} cy={pos.y + 16} r={5}
                          fill={cfg.glow.replace("0.3", "0.8")}
                          style={{ opacity: 0.8 }}
                        />
                      </motion.g>
                    );
                  })}
                </svg>
              </div>

              {/* Selected node forensics panel */}
              <AnimatePresence>
                {selected && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-white/5"
                  >
                    <div className="p-6">
                      <div className="mb-5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Activity className="size-4 text-white/40" />
                          <span className="font-semibold text-white">Node Forensics</span>
                          <Badge className={`${STATUS_CONFIG[(selected.integrity ?? 2) as 0|1|2|3].color} border-0 text-xs text-white ml-2`}>
                            {STATUS_CONFIG[(selected.integrity ?? 2) as 0|1|2|3].label}
                          </Badge>
                        </div>
                        <button onClick={() => setSelected(null)} className="text-white/40 hover:text-white">✕</button>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <div className="mb-1 flex items-center gap-1 text-xs text-white/40"><Clock className="size-3" /> Timestamp</div>
                          <div className="font-mono text-sm text-white">
                            {new Date(selected.timestamp).toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="mb-1 flex items-center gap-1 text-xs text-white/40"><User className="size-3" /> Creator</div>
                          <div className="flex items-center gap-2">
                            <div className="font-mono text-sm text-white truncate">{selected.creator}</div>
                            <CopyBtn text={selected.creator} />
                          </div>
                        </div>
                        <div>
                          <div className="mb-1 text-xs text-white/40">AI Score</div>
                          <div className="font-mono text-sm text-white">
                            {((selected.aiScore ?? 0) / 100).toFixed(1)}% synthetic probability
                          </div>
                        </div>
                        <div>
                          <div className="mb-1 text-xs text-white/40">Revoked</div>
                          <div className={`font-mono text-sm ${selected.revoked ? "text-red-400" : "text-emerald-400"}`}>
                            {selected.revoked ? "YES — CONTENT FLAGGED" : "NO"}
                          </div>
                        </div>
                        <div className="sm:col-span-2">
                          <div className="mb-1 text-xs text-white/40">Media ID</div>
                          <div className="flex items-center gap-2">
                            <div className="font-mono text-sm text-white break-all">{selected.mediaId}</div>
                            <CopyBtn text={selected.mediaId} />
                          </div>
                        </div>
                        {selected.suiTx && (
                          <div className="sm:col-span-2">
                            <div className="mb-1 text-xs text-white/40">Sui Transaction Digest</div>
                            <div className="flex items-center gap-2">
                              <div className="truncate font-mono text-sm text-cyan-400">{selected.suiTx}</div>
                              <CopyBtn text={selected.suiTx} />
                            </div>
                          </div>
                        )}
                        {selected.blobId && (
                          <div className="sm:col-span-2">
                            <div className="mb-1 text-xs text-white/40">Walrus Blob ID</div>
                            <div className="flex items-center gap-2">
                              <div className="truncate font-mono text-sm text-blue-400">{selected.blobId}</div>
                              <CopyBtn text={selected.blobId} />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* Legend */}
        <motion.div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }}>
          <h3 className="mb-4 font-semibold text-white">Legend</h3>
          <div className="flex flex-wrap gap-6">
            {Object.entries(STATUS_CONFIG).map(([k, cfg]) => (
              <div key={k} className="flex items-center gap-2">
                <div className={`size-3 rounded-full ${cfg.color}`} />
                <span className="text-sm text-white/70">{cfg.label}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 ml-auto">
              <div className="w-8 border-t-2 border-dashed border-white/20" />
              <span className="text-xs text-white/40">Auto-detected relationship</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}