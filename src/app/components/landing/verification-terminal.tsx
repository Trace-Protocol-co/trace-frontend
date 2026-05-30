import { motion, AnimatePresence } from "motion/react";
import { useInView } from "motion/react";
import { useRef, useState, useCallback } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Upload, CheckCircle2, AlertCircle, XCircle, Sparkles } from "lucide-react";
import { computeSHA256, computePHash, verifyMedia, type VerifyResult, type Verdict } from "../../lib/api";

// ── Status config — pixel-exact from Figma spec ──────────────────────────────

const STATUS_CONFIG: Record<Verdict, {
  icon: React.ElementType | null;
  title: string;
  description: string;
  color: string;
  badgeClass: string;
  textClass: string;
  borderClass: string;
}> = {
  VERIFIED_ORIGINAL: {
    icon: CheckCircle2,
    title: "VERIFIED ORIGINAL",
    description: "This media has been cryptographically verified as an authentic original",
    color: "text-emerald-400",
    badgeClass: "bg-emerald-500",
    textClass: "text-emerald-400",
    borderClass: "border-emerald-500/30",
  },
  MODIFIED: {
    icon: AlertCircle,
    title: "MODIFIED BUT TRACEABLE",
    description: "This media has been edited but its origin can be verified",
    color: "text-amber-400",
    badgeClass: "bg-amber-500",
    textClass: "text-amber-400",
    borderClass: "border-amber-500/30",
  },
  UNVERIFIED: {
    icon: XCircle,
    title: "UNVERIFIED / TAMPERED",
    description: "No cryptographic proof found — media may be tampered or unregistered",
    color: "text-rose-500",
    badgeClass: "bg-red-500",
    textClass: "text-rose-500",
    borderClass: "border-rose-600/30",
  },
  AI_GENERATED: {
    icon: Sparkles,
    title: "AI GENERATED / SYNTHETIC",
    description: "This media appears to be synthetically generated",
    color: "text-violet-400",
    badgeClass: "bg-violet-500",
    textClass: "text-violet-400",
    borderClass: "border-violet-500/30",
  },
  UNKNOWN: {
    icon: null,
    title: "UNKNOWN",
    description: "Could not determine media status",
    color: "text-sky-400",
    badgeClass: "bg-sky-500",
    textClass: "text-sky-400",
    borderClass: "border-sky-500/30",
  },
};

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className="ml-2 shrink-0 font-mono text-[10px] text-white/30 hover:text-white/60 transition-colors"
    >
      {copied ? "✓" : "COPY"}
    </button>
  );
}

function TerminalError({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/5 px-5 py-4 font-mono text-sm text-red-400"
    >
      <span className="mt-0.5 shrink-0">■</span>
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="shrink-0 text-red-600 hover:text-red-400">✕</button>
    </motion.div>
  );
}

export function VerificationTerminal() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const inputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [phase, setPhase] = useState<"idle" | "hashing" | "scanning" | "done" | "error">("idle");
  const [file, setFile] = useState<File | null>(null);
  const [sha256, setSha256] = useState("");
  const [phash, setPhash] = useState("");
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [error, setError] = useState("");
  const [verifiedMediaId, setVerifiedMediaId] = useState<string | null>(null);

  const handleFile = useCallback(async (f: File) => {
    setFile(f);
    setResult(null);
    setError("");
    setPhase("hashing");
    try {
      const hash = await computeSHA256(f);
      setSha256(hash);
      setPhash(computePHash(hash));
      setPhase("scanning");
      const res = await verifyMedia(f);
      setResult(res);
      // Extract media ID from provenance chain if available
      const mediaId = res.provenance_chain?.[0]?.mediaId ?? null;
      setVerifiedMediaId(mediaId);
      setPhase("done");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Network error — is the TRACE backend running?");
      setPhase("error");
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const reset = () => {
    setPhase("idle");
    setFile(null);
    setSha256("");
    setPhash("");
    setResult(null);
    setError("");
    setVerifiedMediaId(null);
  };

  const cfg = result ? STATUS_CONFIG[result.verdict] ?? STATUS_CONFIG.UNKNOWN : null;
  const Icon = cfg?.icon ?? null;

  return (
    <section ref={ref} className="relative overflow-hidden bg-black py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="mb-4 text-5xl font-bold tracking-tight text-white">Verification Terminal</h2>
          <p className="text-xl text-white/60">Instant authenticity verification for any media</p>
        </motion.div>

        <motion.div
          className="mx-auto max-w-4xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: isInView ? 1 : 0, scale: isInView ? 1 : 0.95 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-zinc-900 to-black shadow-2xl">
            {/* Terminal chrome */}
            <div className="border-b border-white/10 bg-white/5 px-6 py-4 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-red-500" />
                <div className="size-3 rounded-full bg-amber-500" />
                <div className="size-3 rounded-full bg-emerald-500" />
                <span className="ml-4 font-mono text-sm text-white/60">trace-verify.sh</span>
                {file && <span className="ml-auto font-mono text-xs text-white/30">{file.name}</span>}
              </div>
            </div>

            <div className="p-12 space-y-6">
              {/* Error bar */}
              <AnimatePresence>
                {phase === "error" && error && (
                  <TerminalError message={error} onClose={reset} />
                )}
              </AnimatePresence>

              {/* IDLE — drop zone */}
              {phase === "idle" && (
                <motion.div
                  className={`group relative cursor-pointer rounded-xl border-2 border-dashed ${
                    isDragging ? "border-emerald-500 bg-emerald-500/10" : "border-white/20"
                  } p-16 transition-all hover:border-emerald-500/50 hover:bg-white/5`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => inputRef.current?.click()}
                  whileHover={{ scale: 1.01 }}
                >
                  <input
                    ref={inputRef} type="file" className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                  />
                  <div className="flex flex-col items-center gap-4 text-center">
                    <Upload className="size-16 text-white/40 transition-colors group-hover:text-emerald-500" />
                    <div>
                      <div className="mb-2 text-xl font-semibold text-white">Drop media to verify</div>
                      <div className="text-sm text-white/60">Upload an image or video to check its authenticity</div>
                    </div>
                    <Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
                      Choose File
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* HASHING / SCANNING */}
              {(phase === "hashing" || phase === "scanning") && (
                <motion.div
                  className="flex flex-col items-center gap-6 py-16 text-center"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                >
                  <motion.div
                    className="size-20 rounded-full border-4 border-cyan-500/20 border-t-cyan-500"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <div>
                    <div className="mb-2 text-xl font-semibold text-cyan-400">
                      {phase === "hashing" ? "Computing hashes..." : "Scanning provenance graph..."}
                    </div>
                    <div className="text-sm text-white/60">Analyzing cryptographic signatures</div>
                  </div>
                  <div className="space-y-2">
                    {[
                      { text: "Computing SHA-256 hash...", show: true },
                      { text: "Computing perceptual hash (pHash)...", show: !!sha256 },
                      { text: "Querying TRACE registry...", show: phase === "scanning" },
                    ].map(({ text, show }, i) => show && (
                      <motion.div
                        key={text}
                        className="font-mono text-sm text-white/40"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.3 }}
                      >
                        ✓ {text}
                      </motion.div>
                    ))}
                  </div>
                  {sha256 && (
                    <div className="font-mono text-xs text-white/20 max-w-sm truncate">
                      SHA-256: {sha256}
                    </div>
                  )}
                </motion.div>
              )}

              {/* DONE — result */}
              {phase === "done" && result && cfg && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="mb-8 flex flex-col items-center gap-4 text-center">
                    {Icon && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        <Icon className={`size-20 ${cfg.color}`} />
                      </motion.div>
                    )}
                    <div>
                      <Badge className={`mb-3 border-0 ${cfg.badgeClass} text-white`}>
                        {cfg.title}
                      </Badge>
                      <div className="text-sm text-white/60">{cfg.description}</div>
                      <div className="mt-1 font-mono text-xs text-white/30">
                        {(result.confidence * 100).toFixed(0)}% confidence
                      </div>
                    </div>
                  </div>

                  {/* Provenance details */}
                  <div className={`rounded-xl border ${cfg.borderClass} bg-white/5 p-6`}>
                    <div className="mb-4 text-sm font-semibold text-white/80">Provenance Details</div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <div className="mb-1 text-xs text-white/40">First Seen</div>
                        <div className="font-mono text-sm text-white">
                          {result.origin?.first_seen
                            ? new Date(result.origin.first_seen).toLocaleString()
                            : "Unknown"}
                        </div>
                      </div>
                      <div>
                        <div className="mb-1 text-xs text-white/40">Creator</div>
                        <div className="font-mono text-sm text-white truncate">
                          {result.origin?.creator ?? "Unknown"}
                        </div>
                      </div>
                      <div>
                        <div className="mb-1 text-xs text-white/40">Edit Count</div>
                        <div className="font-mono text-sm text-white">
                          {result.provenance_chain.length > 0 ? result.provenance_chain.length - 1 : "—"}
                        </div>
                      </div>
                      <div>
                        <div className="mb-1 text-xs text-white/40">Similarity Score</div>
                        <div className="font-mono text-sm text-white">
                          {result.similarity_matches[0]
                            ? `${(result.similarity_matches[0].similarity * 100).toFixed(0)}%`
                            : result.verdict === "VERIFIED_ORIGINAL" ? "100%" : "N/A"}
                        </div>
                      </div>

                      {/* SHA-256 */}
                      <div className="sm:col-span-2">
                        <div className="mb-1 text-xs text-white/40">SHA-256 Hash</div>
                        <div className="flex items-center">
                          <div className="truncate font-mono text-sm text-white/70">{sha256}</div>
                          <CopyBtn text={sha256} />
                        </div>
                      </div>

                      {result.origin?.sui_tx && (
                        <>
                          <div className="sm:col-span-2">
                            <div className="mb-1 text-xs text-white/40">Sui Transaction</div>
                            <div className="flex items-center">
                              <div className="truncate font-mono text-sm text-cyan-400">{result.origin.sui_tx}</div>
                              <CopyBtn text={result.origin.sui_tx} />
                            </div>
                          </div>
                          <div className="sm:col-span-2">
                            <div className="mb-1 text-xs text-white/40">Walrus Blob ID</div>
                            <div className="flex items-center">
                              <div className="truncate font-mono text-sm text-blue-400">{result.origin.walrus_blob}</div>
                              <CopyBtn text={result.origin.walrus_blob} />
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Flags */}
                    {result.flags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {result.flags.map((f) => (
                          <span key={f} className="rounded border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-xs text-white/50">
                            {f}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Provenance chain */}
                    {result.provenance_chain.length > 0 && (
                      <div className="mt-6 border-t border-white/10 pt-4">
                        <div className="mb-3 text-xs text-white/40">Provenance Chain</div>
                        <div className="space-y-2">
                          {result.provenance_chain.map((node, i) => {
                            const colors = ["text-emerald-400", "text-amber-400", "text-rose-500", "text-violet-400"];
                            const labels = ["ORIGINAL", "MODIFIED", "UNVERIFIED", "AI GENERATED"];
                            const integrity = node.integrity ?? 2;
                            return (
                              <div key={i} className="flex items-center gap-2 font-mono text-xs">
                                <div className={`w-1.5 h-1.5 rounded-full ${["bg-emerald-400","bg-amber-400","bg-rose-500","bg-violet-400"][integrity]}`} />
                                <span className="text-white/40">NODE_{String.fromCharCode(65 + i)}</span>
                                <span className="text-white/20">→</span>
                                <span className={colors[integrity]}>{labels[integrity]}</span>
                                {node.timestamp && (
                                  <span className="ml-auto text-white/20">
                                    {new Date(node.timestamp).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex gap-3">
                    <Button
                      onClick={reset}
                      className="flex-1 border-white/20 bg-white/5 text-white hover:bg-white/10"
                      variant="outline"
                    >
                      Verify Another
                    </Button>
                    {verifiedMediaId && (
                      <Button
                        className="flex-1 bg-white text-black hover:bg-white/90"
                        onClick={() => window.location.href = `/graph/${verifiedMediaId}`}
                      >
                        View Full Provenance
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}