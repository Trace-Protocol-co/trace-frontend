import { motion, AnimatePresence } from "motion/react";
import { useRef, useState, useCallback } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Upload, CheckCircle2, AlertCircle, XCircle, Sparkles, FileQuestion, ExternalLink } from "lucide-react";
import { computeSHA256, computePHash, verifyMedia, type VerifyResult, type Verdict } from "../../lib/api";

const STATUS_CONFIG: Record<Verdict, {
  icon: React.ElementType | null;
  title: string;
  description: string;
  color: string;
  badgeClass: string;
  borderClass: string;
}> = {
  VERIFIED_ORIGINAL: {
    icon: CheckCircle2,
    title: "VERIFIED ORIGINAL",
    description: "Cryptographically verified as an authentic original. This media has an immutable provenance record on Sui blockchain.",
    color: "text-emerald-400",
    badgeClass: "bg-emerald-500",
    borderClass: "border-emerald-500/30",
  },
  MODIFIED: {
    icon: AlertCircle,
    title: "MODIFIED BUT TRACEABLE",
    description: "This media has been edited but its origin is verifiable. The full edit chain is recorded on-chain.",
    color: "text-amber-400",
    badgeClass: "bg-amber-500",
    borderClass: "border-amber-500/30",
  },
  UNVERIFIED: {
    icon: XCircle,
    title: "NOT IN TRACE REGISTRY",
    description: "This media has no cryptographic proof on the TRACE protocol. It may be authentic but has not been registered — or it may have been tampered with.",
    color: "text-rose-500",
    badgeClass: "bg-red-500",
    borderClass: "border-rose-600/30",
  },
  AI_GENERATED: {
    icon: Sparkles,
    title: "AI GENERATED / SYNTHETIC",
    description: "This media appears to be synthetically generated based on perceptual analysis.",
    color: "text-violet-400",
    badgeClass: "bg-violet-500",
    borderClass: "border-violet-500/30",
  },
  UNKNOWN: {
    icon: FileQuestion,
    title: "UNKNOWN",
    description: "Could not determine media status.",
    color: "text-sky-400",
    badgeClass: "bg-sky-500",
    borderClass: "border-sky-500/30",
  },
};

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className="ml-2 shrink-0 font-mono text-[10px] text-white/30 hover:text-white/60 transition-colors">
      {copied ? "✓" : "COPY"}
    </button>
  );
}

function Row({ label, value, mono = true, color }: { label: string; value: string; mono?: boolean; color?: string }) {
  return (
    <div>
      <div className="mb-1 text-xs text-white/40">{label}</div>
      <div className={`flex items-center ${mono ? "font-mono" : ""} text-sm ${color ?? "text-white"} truncate`}>
        <span className="truncate">{value}</span>
        {mono && value && value !== "Unknown" && value !== "—" && <CopyBtn text={value} />}
      </div>
    </div>
  );
}

export function VerificationTerminal() {
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
    setPhase("idle"); setFile(null); setSha256(""); setPhash("");
    setResult(null); setError(""); setVerifiedMediaId(null);
  };

  const cfg = result ? STATUS_CONFIG[result.verdict] ?? STATUS_CONFIG.UNKNOWN : null;
  const Icon = cfg?.icon ?? null;
  const isNotInRegistry = result?.verdict === "UNVERIFIED" || result?.verdict === "AI_GENERATED";
  const isVerified = result?.verdict === "VERIFIED_ORIGINAL" || result?.verdict === "MODIFIED";

  // Estimate file info for unregistered media
  const fileType = file?.type?.split("/")?.[0] ?? "unknown";
  const fileSizeKB = file ? (file.size / 1024).toFixed(1) : "—";
  const fileSizeMB = file ? (file.size / (1024 * 1024)).toFixed(2) : "—";

  return (
    <section className="relative overflow-hidden bg-black py-20">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="mb-4 text-5xl font-bold tracking-tight text-white">Verification Terminal</h2>
          <p className="text-xl text-white/60">Instant authenticity check for any media file</p>
        </motion.div>

        <motion.div className="mx-auto max-w-4xl"
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-zinc-900 to-black shadow-2xl">

            {/* Terminal chrome */}
            <div className="border-b border-white/10 bg-white/5 px-6 py-4">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-red-500" />
                <div className="size-3 rounded-full bg-amber-500" />
                <div className="size-3 rounded-full bg-emerald-500" />
                <span className="ml-4 font-mono text-sm text-white/60">trace-verify.sh</span>
                {file && <span className="ml-auto font-mono text-xs text-white/30">{file.name}</span>}
              </div>
            </div>

            <div className="p-8 sm:p-12 space-y-6">

              {/* Error */}
              <AnimatePresence>
                {phase === "error" && error && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/5 px-5 py-4 font-mono text-sm text-red-400">
                    <span className="shrink-0">■</span>
                    <span className="flex-1">{error}</span>
                    <button onClick={reset} className="shrink-0 text-red-600 hover:text-red-400">✕</button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* IDLE */}
              {phase === "idle" && (
                <motion.div
                  className={`group relative cursor-pointer rounded-xl border-2 border-dashed ${
                    isDragging ? "border-emerald-500 bg-emerald-500/10" : "border-white/20"
                  } p-16 transition-all hover:border-emerald-500/50 hover:bg-white/5`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => inputRef.current?.click()}
                  whileHover={{ scale: 1.01 }}>
                  <input ref={inputRef} type="file" className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
                  <div className="flex flex-col items-center gap-4 text-center">
                    <Upload className="size-16 text-white/40 transition-colors group-hover:text-emerald-500" />
                    <div>
                      <div className="mb-2 text-xl font-semibold text-white">Drop any media to verify</div>
                      <div className="text-sm text-white/60">Works even for media not in TRACE registry</div>
                      <div className="mt-2 text-xs text-white/30">Image, video, audio — any file type</div>
                    </div>
                    <Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
                      Choose File
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* HASHING / SCANNING */}
              {(phase === "hashing" || phase === "scanning") && (
                <motion.div className="flex flex-col items-center gap-6 py-16 text-center"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <motion.div className="size-20 rounded-full border-4 border-cyan-500/20 border-t-cyan-500"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                  <div>
                    <div className="mb-2 text-xl font-semibold text-cyan-400">
                      {phase === "hashing" ? "Computing fingerprints..." : "Scanning TRACE registry..."}
                    </div>
                    <div className="text-sm text-white/60">Analyzing cryptographic signatures</div>
                  </div>
                  <div className="space-y-2 text-left">
                    {[
                      { text: "Computing SHA-256 content hash...", show: true },
                      { text: "Computing perceptual hash (pHash)...", show: !!sha256 },
                      { text: "Querying Sui blockchain registry...", show: phase === "scanning" },
                      { text: "Running AI detection analysis...", show: phase === "scanning" },
                    ].map(({ text, show }, i) => show && (
                      <motion.div key={text} className="font-mono text-sm text-white/40"
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.2 }}>
                        ✓ {text}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* DONE */}
              {phase === "done" && result && cfg && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>

                  {/* Verdict header */}
                  <div className="mb-8 flex flex-col items-center gap-4 text-center">
                    {Icon && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}>
                        <Icon className={`size-20 ${cfg.color}`} />
                      </motion.div>
                    )}
                    <div>
                      <Badge className={`mb-3 border-0 ${cfg.badgeClass} text-white`}>{cfg.title}</Badge>
                      <div className="text-sm text-white/60 max-w-md">{cfg.description}</div>
                      <div className="mt-1 font-mono text-xs text-white/30">
                        {(result.confidence * 100).toFixed(0)}% confidence
                      </div>
                    </div>
                  </div>

                  {/* File analysis — always shown */}
                  <div className="rounded-xl border border-white/10 bg-white/5 p-6 mb-4">
                    <div className="mb-4 text-sm font-semibold text-white/80">File Analysis</div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Row label="File Name" value={file?.name ?? "—"} mono={false} color="text-white" />
                      <Row label="File Size" value={`${fileSizeMB} MB (${fileSizeKB} KB)`} mono={false} />
                      <Row label="Media Type" value={fileType.charAt(0).toUpperCase() + fileType.slice(1)} mono={false} />
                      <Row label="Last Modified" value={file ? new Date(file.lastModified).toLocaleString() : "—"} mono={false} />
                      <div className="sm:col-span-2">
                        <div className="mb-1 text-xs text-white/40">SHA-256 Hash</div>
                        <div className="flex items-center font-mono text-sm text-white/70">
                          <span className="truncate">{sha256}</span>
                          <CopyBtn text={sha256} />
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <div className="mb-1 text-xs text-white/40">Perceptual Hash (pHash)</div>
                        <div className="flex items-center font-mono text-sm text-white/70">
                          <span className="truncate">{phash}</span>
                          <CopyBtn text={phash} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* NOT IN REGISTRY — special section */}
                  {isNotInRegistry && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className={`rounded-xl border ${cfg.borderClass} bg-white/5 p-6 mb-4`}>
                      <div className="mb-3 flex items-center gap-2">
                        <FileQuestion className="size-5 text-rose-500" />
                        <div className="text-sm font-semibold text-white">Not in TRACE Registry</div>
                      </div>
                      <div className="space-y-3 text-sm text-white/60">
                        <p>This file has <strong className="text-white">no cryptographic proof</strong> on the TRACE protocol. This means:</p>
                        <ul className="space-y-1.5 ml-4">
                          <li className="flex items-start gap-2">
                            <span className="text-rose-500 mt-0.5">•</span>
                            It was never registered on the TRACE protocol
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-rose-500 mt-0.5">•</span>
                            Its origin and authenticity cannot be cryptographically verified
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-rose-500 mt-0.5">•</span>
                            It may have been altered without a traceable record
                          </li>
                        </ul>
                        {result.verdict === "AI_GENERATED" && (
                          <div className="mt-3 p-3 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs">
                            ⚠ AI analysis suggests this media may be synthetically generated with ~{(result.confidence * 100).toFixed(0)}% probability.
                          </div>
                        )}
                        <div className="mt-4 pt-3 border-t border-white/10">
                          <p className="text-xs text-white/40">
                            If you are the creator, register this media on TRACE to establish an immutable provenance record.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* IN REGISTRY — provenance details */}
                  {isVerified && (
                    <div className={`rounded-xl border ${cfg.borderClass} bg-white/5 p-6 mb-4`}>
                      <div className="mb-4 text-sm font-semibold text-white/80">On-Chain Provenance</div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Row label="First Registered"
                          value={result.origin?.first_seen ? new Date(result.origin.first_seen).toLocaleString() : "Unknown"}
                          mono={false} />
                        <Row label="Creator Address" value={result.origin?.creator ?? "Unknown"} color="text-cyan-400" />
                        <Row label="Edit Count"
                          value={result.provenance_chain.length > 0 ? String(result.provenance_chain.length - 1) : "0"}
                          mono={false} />
                        <Row label="Similarity Score"
                          value={result.similarity_matches[0]
                            ? `${(result.similarity_matches[0].similarity * 100).toFixed(0)}%`
                            : result.verdict === "VERIFIED_ORIGINAL" ? "100%" : "N/A"}
                          mono={false} />
                        {result.origin?.sui_tx && (
                          <div className="sm:col-span-2">
                            <div className="mb-1 text-xs text-white/40">Sui Transaction</div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm text-cyan-400 truncate">{result.origin.sui_tx}</span>
                              <CopyBtn text={result.origin.sui_tx} />
                              <a href={`https://suiexplorer.com/txblock/${result.origin.sui_tx}?network=testnet`}
                                target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="size-3 text-white/30 hover:text-cyan-400" />
                              </a>
                            </div>
                          </div>
                        )}
                        {result.origin?.walrus_blob && (
                          <div className="sm:col-span-2">
                            <div className="mb-1 text-xs text-white/40">Walrus Blob ID</div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm text-blue-400 truncate">{result.origin.walrus_blob}</span>
                              <CopyBtn text={result.origin.walrus_blob} />
                              <a href={`https://walruscan.com/testnet/blob/${result.origin.walrus_blob}`}
                                target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="size-3 text-white/30 hover:text-blue-400" />
                              </a>
                            </div>
                          </div>
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
                              const colors = ["text-emerald-400","text-amber-400","text-rose-500","text-violet-400"];
                              const labels = ["ORIGINAL","MODIFIED","UNVERIFIED","AI GENERATED"];
                              const integrity = node.integrity ?? 2;
                              return (
                                <div key={i} className="flex items-center gap-2 font-mono text-xs">
                                  <div className={`w-1.5 h-1.5 rounded-full ${["bg-emerald-400","bg-amber-400","bg-rose-500","bg-violet-400"][integrity]}`} />
                                  <span className="text-white/40">NODE_{String.fromCharCode(65+i)}</span>
                                  <span className="text-white/20">→</span>
                                  <span className={colors[integrity]}>{labels[integrity]}</span>
                                  {node.timestamp && <span className="ml-auto text-white/20">{new Date(node.timestamp).toLocaleDateString()}</span>}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Collective Memory Bank */}
                  {result.bank && (
                    <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5 mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-xs font-semibold text-blue-400 tracking-wider">COLLECTIVE MEMORY BANK</div>
                        <div className="flex items-center gap-1.5">
                          <div className="size-1.5 rounded-full bg-blue-400 animate-pulse" />
                          <span className="text-xs text-blue-400/70">MemWal on Walrus</span>
                        </div>
                      </div>
                      {result.bank.known && result.bank.sighting_count ? (
                        <div className="grid grid-cols-3 gap-3 mb-3">
                          <div className="rounded-lg bg-black/40 p-3 text-center">
                            <div className="text-2xl font-bold text-white">{result.bank.sighting_count}</div>
                            <div className="text-xs text-white/40 mt-0.5">Total Sightings</div>
                          </div>
                          <div className="rounded-lg bg-black/40 p-3 text-center">
                            <div className="text-xs font-medium text-white mt-1 truncate">{result.bank.first_seen ? new Date(result.bank.first_seen).toLocaleDateString() : "—"}</div>
                            <div className="text-xs text-white/40 mt-0.5">First Seen</div>
                          </div>
                          <div className="rounded-lg bg-black/40 p-3 text-center">
                            <div className="text-xs font-medium text-white mt-1">{result.bank.sources?.length ?? 0}</div>
                            <div className="text-xs text-white/40 mt-0.5">Sources</div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-white/50 mb-2">First encounter — no prior sightings in bank</div>
                      )}
                      <div className="flex items-center gap-2 text-xs">
                        <div className={`size-1.5 rounded-full ${result.bank.contributed_to_bank ? "bg-emerald-400" : "bg-white/20"}`} />
                        <span className="text-white/50">{result.bank.message ?? "Sighting recorded"}</span>
                        {result.bank.bank_blob_id && (
                          <a href={`https://aggregator.walrus-testnet.walrus.space/v1/${result.bank.bank_blob_id}`}
                            target="_blank" rel="noopener noreferrer"
                            className="ml-auto text-blue-400/70 hover:text-blue-400">
                            <ExternalLink className="size-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button onClick={reset} variant="outline"
                      className="flex-1 border-white/20 bg-white/5 text-white hover:bg-white/10">
                      Verify Another
                    </Button>
                    {isNotInRegistry && (
                      <Button className="flex-1 bg-white text-black hover:bg-white/90 font-semibold"
                        onClick={() => window.location.href = "/upload"}>
                        Register This Media →
                      </Button>
                    )}
                    {verifiedMediaId && (
                      <Button className="flex-1 bg-white text-black hover:bg-white/90 font-semibold"
                        onClick={() => window.location.href = `/graph/${verifiedMediaId}`}>
                        View Full Provenance →
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