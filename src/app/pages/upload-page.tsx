import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Upload, CheckCircle2, Loader2, XCircle, LogIn } from "lucide-react";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router";
import { computeSHA256, computePHash, registerMedia, type RegisterResult } from "../lib/api";
import { isAuthenticated, getZkLoginAddress, getZkLoginEmail, initiateGoogleLogin } from "../lib/zklogin";

const EDIT_TYPES = [
  { value: "0", label: "ORIGINAL" },
  { value: "1", label: "TRIM" },
  { value: "2", label: "COLOR GRADE" },
  { value: "3", label: "SUBTITLE" },
  { value: "4", label: "AI REMIX" },
  { value: "5", label: "CROP" },
  { value: "6", label: "MERGE" },
  { value: "7", label: "TRANSLATE" },
];

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className="font-mono text-[10px] text-white/30 hover:text-white/60 transition-colors"
    >
      {copied ? "✓ COPIED" : "COPY"}
    </button>
  );
}

export function UploadPage() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const [phase, setPhase] = useState<"idle" | "hashing" | "uploading" | "complete" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [sha256, setSha256] = useState("");
  const [phash, setPhash] = useState("");
  const [editType, setEditType] = useState("0");
  const [aiScore, setAiScore] = useState(0);
  const [description, setDescription] = useState("");
  const [parentId, setParentId] = useState("");
  const [gps, setGps] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [mediaType, setMediaType] = useState("image");
  const [result, setResult] = useState<RegisterResult | null>(null);
  const [error, setError] = useState("");

  const handleFile = useCallback(async (f: File) => {
    setFile(f);
    setResult(null);
    setError("");
    // Auto-detect media type
    const detectedType = f.type.startsWith("video") ? "video"
                       : f.type.startsWith("audio") ? "audio"
                       : "image";
    setMediaType(detectedType);
    setPhase("hashing");
    try {
      const hash = await computeSHA256(f);
      setSha256(hash);
      setPhash(computePHash(hash));
      setPhase("idle");
    } catch {
      setError("Failed to compute file hash.");
      setPhase("error");
    }
  }, []);

  const captureGPS = () => {
    if (!navigator.geolocation) return;
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => { setGps({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setGpsLoading(false); },
      () => setGpsLoading(false),
      { timeout: 10000 }
    );
  };

  const handleUpload = async () => {
    if (!file) return;
    setPhase("uploading");
    setProgress(0);
    setError("");

    // Animate progress steps
    const steps = [
      { pct: 20, label: "hashing" },
      { pct: 55, label: "walrus" },
      { pct: 85, label: "sui" },
    ];
    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < steps.length) {
        setProgress(steps[stepIdx].pct);
        stepIdx++;
      }
    }, 600);

    try {
      const res = await registerMedia({
        file, editType, aiScore: String(aiScore), description, parentId,
        creatorAddress: getZkLoginAddress() ?? undefined,
        creatorEmail: getZkLoginEmail() ?? undefined,
      });
      clearInterval(interval);
      setProgress(100);
      setResult(res);
      setPhase("complete");
    } catch (err: unknown) {
      clearInterval(interval);
      setError(err instanceof Error ? err.message : "Registration failed — is the backend running?");
      setPhase("error");
    }
  };

  const reset = () => {
    setPhase("idle");
    setFile(null);
    setSha256("");
    setPhash("");
    setResult(null);
    setError("");
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="mb-4 text-5xl font-bold text-white">Upload Original Media</h1>
          <p className="text-xl text-white/60">
            Register your media on-chain and create permanent proof of authenticity
          </p>
        </motion.div>

        <motion.div
          className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-zinc-900 to-black shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {/* Error bar */}
          <AnimatePresence>
            {phase === "error" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-3 border-b border-red-500/20 bg-red-500/5 px-8 py-4 font-mono text-sm text-red-400"
              >
                <XCircle className="size-4 shrink-0" />
                <span className="flex-1">{error}</span>
                <button onClick={() => setPhase("idle")} className="text-red-600 hover:text-red-400">✕</button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* IDLE + file selection */}
          {(phase === "idle" || phase === "hashing") && (
            <div className="p-12 space-y-6">

              {/* Auth gate — must sign in to upload */}
              {!isAuthenticated() && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-6 text-center"
                >
                  <LogIn className="mx-auto mb-3 size-8 text-amber-400" />
                  <h3 className="mb-2 font-semibold text-white">Sign In Required</h3>
                  <p className="mb-4 text-sm text-white/60">
                    You must sign in with Google to register media. This anchors your identity
                    to the on-chain record — proving exactly who minted the truth hash.
                  </p>
                  <Button
                    className="bg-white text-black hover:bg-white/90 font-semibold"
                    onClick={() => initiateGoogleLogin()}
                  >
                    Sign in with Google to Continue
                  </Button>
                  <p className="mt-3 text-xs text-white/30">
                    Verification (reading) is always free and requires no sign-in.
                  </p>
                </motion.div>
              )}

              {/* Show creator identity when signed in */}
              {isAuthenticated() && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex items-center gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3"
                >
                  <div className="size-2 rounded-full bg-emerald-400" />
                  <div className="flex-1">
                    <div className="text-xs text-white/40">Registering as</div>
                    <div className="text-sm font-mono text-emerald-400">{getZkLoginEmail()}</div>
                    <div className="text-xs text-white/30 truncate">{getZkLoginAddress()}</div>
                  </div>
                </motion.div>
              )}
              <div
                className={`cursor-pointer rounded-xl border-2 border-dashed ${
                  isDragging ? "border-emerald-500 bg-emerald-500/10" : "border-white/20"
                } p-16 transition-all hover:border-emerald-500/50 hover:bg-white/5`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
                onClick={() => inputRef.current?.click()}
              >
                <input ref={inputRef} type="file" className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
                <div className="flex flex-col items-center gap-6 text-center">
                  {phase === "hashing"
                    ? <Loader2 className="size-16 animate-spin text-cyan-500" />
                    : <Upload className="size-16 text-white/40" />}
                  <div>
                    {file
                      ? <div className="text-xl font-semibold text-white">{file.name} <span className="text-white/40 text-base">({(file.size / 1024).toFixed(1)} KB)</span></div>
                      : <>
                          <div className="mb-2 text-2xl font-semibold text-white">Drop your media here</div>
                          <div className="text-white/60">or click to browse files</div>
                          <div className="mt-4 text-sm text-white/40">Supports: JPG, PNG, MP4, MOV (max 2GB)</div>
                        </>}
                  </div>
                </div>
              </div>

              {/* Hash preview */}
              {sha256 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40">SHA-256</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-white/60 max-w-xs truncate">{sha256}</span>
                      <CopyBtn text={sha256} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40">pHash</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-white/60">{phash}</span>
                      <CopyBtn text={phash} />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Form */}
              {file && sha256 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                  {/* Media Type */}
                  <div>
                    <label className="mb-2 block text-sm text-white/60">Media Type</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: "image", label: "🖼 Image" },
                        { value: "video", label: "🎥 Video" },
                        { value: "audio", label: "🎵 Audio" },
                      ].map((t) => (
                        <button key={t.value}
                          onClick={() => setMediaType(t.value)}
                          className={`rounded-lg border py-2 text-sm transition-all
                            ${mediaType === t.value
                              ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                              : "border-white/10 bg-white/5 text-white/50 hover:border-white/20"}`}>
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Parent ID — only show if user explicitly wants to register a derivative */}
                  <div>
                    <label className="mb-2 block text-sm text-white/60">
                      Parent Media ID <span className="text-white/30">(optional — only for derivatives)</span>
                    </label>
                    <input type="text" value={parentId} onChange={(e) => setParentId(e.target.value)}
                      placeholder="0x... leave empty for original media"
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 font-mono text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30" />
                    <p className="mt-1 text-xs text-white/30">If this is an edit of existing media, paste the original media ID here.</p>
                  </div>

                  <Button onClick={handleUpload}
                    disabled={!file || phase === "uploading" || !isAuthenticated()}
                    className="w-full bg-white text-black hover:bg-white/90 py-6 text-base font-semibold disabled:opacity-40">
                    {!isAuthenticated() ? "Sign In Required" : "Anchor to Chain"}
                  </Button>
                </motion.div>
              )}

              {/* What happens next */}
              {!file && (
                <div className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-6">
                  <h3 className="font-semibold text-white">What happens next?</h3>
                  <ul className="space-y-2 text-sm text-white/70">
                    {[
                      "SHA-256 hash computed client-side — file never leaves your browser unencrypted",
                      "Media blob stored on Walrus decentralized storage",
                      "Cryptographic hash registered on Sui blockchain with consensus timestamp",
                      "You receive a permanent on-chain provenance certificate",
                    ].map((t) => (
                      <li key={t} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* UPLOADING */}
          {phase === "uploading" && (
            <div className="p-12">
              <div className="flex flex-col items-center gap-6 py-12 text-center">
                <Loader2 className="size-16 animate-spin text-cyan-500" />
                <div>
                  <div className="mb-2 text-2xl font-semibold text-white">Anchoring to chain...</div>
                  <div className="text-white/60">This may take a few moments</div>
                </div>
                <div className="w-full max-w-md space-y-3">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className="h-full bg-emerald-500 rounded-full"
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                  <div className="font-mono text-sm text-white/40">{progress}%</div>
                </div>
                <div className="space-y-2">
                  {progress >= 20 && (
                    <motion.div className="font-mono text-sm text-white/60" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                      ✓ Computing cryptographic hashes...
                    </motion.div>
                  )}
                  {progress >= 55 && (
                    <motion.div className="font-mono text-sm text-white/60" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                      ✓ Uploading to Walrus decentralized storage...
                    </motion.div>
                  )}
                  {progress >= 85 && (
                    <motion.div className="font-mono text-sm text-white/60" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                      ✓ Broadcasting Sui transaction...
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* COMPLETE */}
          {phase === "complete" && result && (
            <motion.div className="p-12" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="mb-8 flex flex-col items-center gap-6 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
                  <CheckCircle2 className="size-20 text-emerald-500" />
                </motion.div>
                <div>
                  <div className="mb-2 text-3xl font-bold text-white">Successfully Registered!</div>
                  <div className="text-white/60">Your media is now permanently verified on-chain</div>
                </div>
              </div>

              <div className="space-y-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <div className="mb-1 text-xs text-white/40">Media ID</div>
                    <div className="flex items-center gap-2">
                      <div className="font-mono text-sm text-white truncate">{result.media_id}</div>
                      <CopyBtn text={result.media_id} />
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 text-xs text-white/40">Timestamp</div>
                    <div className="font-mono text-sm text-white">
                      {new Date(result.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 text-xs text-white/40">Sui Transaction</div>
                    <div className="flex items-center gap-2">
                      <div className="truncate font-mono text-sm text-cyan-400">{result.sui_tx}</div>
                      <CopyBtn text={result.sui_tx} />
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 text-xs text-white/40">Walrus Blob</div>
                    <div className="flex items-center gap-2">
                      <div className="truncate font-mono text-sm text-blue-400">{result.walrus_blob}</div>
                      <CopyBtn text={result.walrus_blob} />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <div className="mb-1 text-xs text-white/40">SHA-256</div>
                    <div className="flex items-center gap-2">
                      <div className="truncate font-mono text-sm text-white/60">{sha256}</div>
                      <CopyBtn text={sha256} />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <div className="mb-1 text-xs text-white/40">Certificate URL</div>
                    <div className="flex items-center gap-2">
                      <a href={result.certificate_url} target="_blank" rel="noopener noreferrer"
                        className="truncate font-mono text-sm text-emerald-400 hover:underline">
                        {result.certificate_url}
                      </a>
                      <CopyBtn text={result.certificate_url} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <Button
                  onClick={() => navigate(`/graph/${result.media_id}`)}
                  className="flex-1 bg-white text-black hover:bg-white/90"
                >
                  View Provenance Graph
                </Button>
                <Button onClick={reset} variant="outline"
                  className="flex-1 border-white/20 bg-white/5 text-white hover:bg-white/10">
                  Upload Another
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}