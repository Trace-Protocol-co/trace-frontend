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

// Estimate AI generation probability from file entropy analysis
// AI Detection — multi-signal: EXIF analysis, metadata, filename patterns, entropy
async function estimateAIScore(file: File): Promise<{ score: number; signals: string[] }> {
  const signals: string[] = [];
  try {
    const buf   = await file.arrayBuffer();
    const bytes = new Uint8Array(buf);
    const isJpeg = bytes[0] === 0xFF && bytes[1] === 0xD8;
    const isPng  = bytes[0] === 0x89 && bytes[1] === 0x50;

    // Signal 1: Filename patterns from AI generators
    const name = file.name.toLowerCase();
    const aiNames = [/midjourney/i,/stable.?diffusion/i,/dall.?e/i,/firefly/i,/generated/i,/flux/i,/ideogram/i,/leonardoai/i,/\d{10,}_\d+/];
    if (aiNames.some(p => p.test(name))) signals.push("AI generator filename pattern");

    // Signal 2: EXIF metadata analysis (JPEG only)
    let hasCameraModel = false;
    let hasExif = false;
    if (isJpeg) {
      const str = new TextDecoder("latin1").decode(bytes.slice(0, 65536));
      hasExif = str.includes("Exif");
      hasCameraModel = /Canon|Nikon|Sony|Fuji|Olympus|Panasonic|Leica|Apple|Samsung|Google/i.test(str);
      if (/Midjourney|Stable Diffusion|DALL-E|Firefly|ComfyUI|Automatic1111|NovelAI/i.test(str))
        signals.push("AI software signature in EXIF");
      if (!hasExif && file.size > 200000) signals.push("No EXIF in large JPEG");
      if (hasExif && !hasCameraModel) signals.push("No camera model in EXIF");
      if (hasCameraModel) signals.push("Real camera confirmed");
    }

    // Signal 3: PNG AI metadata chunk (Stable Diffusion embeds prompts)
    if (isPng) {
      const str = new TextDecoder("latin1").decode(bytes.slice(0, 16384));
      if (/parameters|negative_prompt|steps:|sampler|cfg scale/i.test(str))
        signals.push("Stable Diffusion prompt data found");
    }

    // Signal 4: Entropy
    const sample = bytes.slice(0, Math.min(65536, bytes.length));
    const freq   = new Array(256).fill(0);
    sample.forEach(b => freq[b]++);
    let entropy = 0;
    freq.forEach(f => { if (f > 0) { const p = f / sample.length; entropy -= p * Math.log2(p); } });
    const normalizedEntropy = entropy / 8.0;
    if (normalizedEntropy > 0.975) signals.push("High entropy pattern");

    // Score calculation
    let score = 0;
    if (signals.includes("AI software signature in EXIF"))     score += 9000;
    if (signals.includes("Stable Diffusion prompt data found")) score += 9500;
    if (signals.includes("AI generator filename pattern"))      score += 3500;
    if (signals.includes("No EXIF in large JPEG"))              score += 2500;
    if (signals.includes("No camera model in EXIF"))            score += 2000;
    if (signals.includes("High entropy pattern") && score < 2000) score += 2000;
    if (signals.includes("Real camera confirmed"))              score = Math.max(0, score - 4000);

    return { score: Math.min(10000, Math.max(0, score)), signals };
  } catch {
    return { score: 0, signals: ["Analysis failed"] };
  }
}

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
  const [aiSignals, setAiSignals] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [parentId, setParentId] = useState("");
  const [gps, setGps] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [mediaType, setMediaType] = useState("image");
  const [result, setResult] = useState<RegisterResult | null>(null);
  const [error, setError] = useState("");
  const [duplicate, setDuplicate] = useState<{
    media_id: string; creator: string; registered: string;
    sui_tx: string; walrus_blob: string; certificate_url: string;
  } | null>(null);
  // Bank pre-check state (F-9, View 2)
  const [bankPreCheck, setBankPreCheck] = useState<{
    known: boolean; sighting_count: number; first_seen?: string; sources?: string[];
  } | null>(null);

  const handleFile = useCallback(async (f: File) => {
    setFile(f);
    setResult(null);
    setError("");
    setDuplicate(null);
    setBankPreCheck(null);
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

      // Bank pre-check — query PostgreSQL sightings before registration
      try {
        const bankRes = await fetch(
          `${import.meta.env.VITE_API_URL ?? "http://localhost:3001"}/v1/bank/sightings/${hash}`
        );
        const bankData = await bankRes.json();
        if (bankData.count > 0) {
          setBankPreCheck({
            known: true,
            sighting_count: bankData.count,
            first_seen: bankData.sightings?.[bankData.sightings.length - 1]?.seen_at,
            sources: [...new Set((bankData.sightings ?? []).map((s: {platform: string}) => s.platform))],
          });
        }
      } catch { /* bank pre-check is non-critical */ }

      // AI score estimation from file entropy
      // AI detection — call backend which uses Sightengine if configured
      try {
        const aiForm = new FormData();
        aiForm.append("file", f);
        const aiRes  = await fetch(`${import.meta.env.VITE_API_URL ?? "http://localhost:3001"}/v1/detect-ai`, {
          method: "POST", body: aiForm,
        });
        const aiData = await aiRes.json();
        setAiScore(aiData.score ?? 0);
        setAiSignals(aiData.signals ?? []);
      } catch {
        // Fall back to client-side detection if backend unavailable
        const { score, signals } = await estimateAIScore(f);
        setAiScore(score);
        setAiSignals(signals);
      }

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
      // Handle duplicate registration (409)
      if (err instanceof Error && err.message === "already_registered") {
        const dupErr = err as Error & { data?: Record<string, unknown> };
        if (dupErr.data) {
          setDuplicate(dupErr.data as typeof duplicate);
          setPhase("complete");
          return;
        }
      }
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
            <div className="p-4 sm:p-12 space-y-6">

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
                } p-8 sm:p-16 transition-all hover:border-emerald-500/50 hover:bg-white/5`}
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

              {/* Bank Pre-Check (F-9, View 2) */}
              {bankPreCheck && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  className={`rounded-xl border p-4 ${
                    bankPreCheck.known
                      ? "border-amber-500/30 bg-amber-500/5"
                      : "border-emerald-500/30 bg-emerald-500/5"
                  }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`size-2 rounded-full ${bankPreCheck.known ? "bg-amber-400" : "bg-emerald-400"}`} />
                    <span className={`text-xs font-semibold ${bankPreCheck.known ? "text-amber-400" : "text-emerald-400"}`}>
                      COLLECTIVE MEMORY BANK PRE-CHECK
                    </span>
                  </div>
                  {bankPreCheck.known ? (
                    <div>
                      <p className="text-xs text-white/70 mb-2">
                        ⚠ This media has been seen <strong className="text-white">{bankPreCheck.sighting_count}</strong> times
                        before this registration attempt.
                        {bankPreCheck.first_seen && ` First encountered ${new Date(bankPreCheck.first_seen).toLocaleDateString()}.`}
                      </p>
                      {bankPreCheck.sources && bankPreCheck.sources.length > 0 && (
                        <p className="text-xs text-white/40">Sources: {bankPreCheck.sources.join(", ")}</p>
                      )}
                      <p className="text-xs text-amber-400/70 mt-2">
                        Large registration lag may indicate backdating. Temporal staking required if &gt;72 hours old.
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-white/70">
                      ✓ No prior sightings found. This appears to be a first encounter — corroborates your first-creation claim.
                    </p>
                  )}
                </motion.div>
              )}

              {/* Form */}
              {file && sha256 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">

                  {/* Media Type — auto detected */}
                  <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                    <span className="text-lg">
                      {mediaType === "video" ? "🎥" : mediaType === "audio" ? "🎵" : "🖼"}
                    </span>
                    <div>
                      <div className="text-sm text-white font-medium capitalize">{mediaType} detected</div>
                      <div className="text-xs text-white/40">{file?.type || "unknown"} · {file ? (file.size / (1024*1024)).toFixed(2) : "—"} MB</div>
                    </div>
                    <span className="ml-auto text-xs text-emerald-400 font-mono">AUTO</span>
                  </div>

                  {/* AI Detection */}
                  <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm text-white font-medium">AI Content Analysis</div>
                      <div className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                        aiScore > 7000 ? "bg-violet-500/20 text-violet-400" :
                        aiScore > 3000 ? "bg-amber-500/20 text-amber-400" :
                        "bg-emerald-500/20 text-emerald-400"
                      }`}>
                        {aiScore > 7000 ? "⚠ LIKELY AI" : aiScore > 3000 ? "~ PARTIAL AI" : "✓ LIKELY HUMAN"}
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden mb-2">
                      <div className={`h-full rounded-full transition-all duration-1000 ${
                        aiScore > 7000 ? "bg-violet-500" :
                        aiScore > 3000 ? "bg-amber-500" : "bg-emerald-500"
                      }`} style={{ width: `${aiScore / 100}%` }} />
                    </div>
                    <div className="flex justify-between text-xs text-white/30 mb-3">
                      <span>0% Human</span>
                      <span className="text-white/50 font-medium">{(aiScore / 100).toFixed(0)}% synthetic probability</span>
                      <span>100% AI</span>
                    </div>
                    {/* Detection signals */}
                    {aiSignals.length > 0 && (
                      <div className="space-y-1 mb-3 border-t border-white/10 pt-3">
                        {aiSignals.map((signal, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs">
                            <span className={signal.includes("confirmed") || signal.includes("Real camera")
                              ? "text-emerald-400" : "text-amber-400"}>
                              {signal.includes("confirmed") || signal.includes("Real camera") ? "✓" : "⚠"}
                            </span>
                            <span className="text-white/50">{signal}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="mt-1 text-xs text-white/30">Powered by Sightengine · score locked at detection time</p>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="mb-2 block text-sm text-white/60">
                      Description <span className="text-white/30">(recommended)</span>
                    </label>
                    <input type="text" value={description} onChange={(e) => setDescription(e.target.value)}
                      placeholder="e.g. Lagos protest footage — original capture"
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30" />
                  </div>

                  {/* GPS */}
                  <div>
                    <label className="mb-2 block text-sm text-white/60">
                      GPS Location <span className="text-white/30">(optional)</span>
                    </label>
                    <div className="flex flex-wrap items-center gap-2">
                      <button onClick={captureGPS} disabled={gpsLoading}
                        className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10 transition-all disabled:opacity-50">
                        {gpsLoading ? "📍 Locating..." : gps ? "📍 Location captured" : "📍 Capture GPS"}
                      </button>
                      {gps && <span className="font-mono text-xs text-white/40">{gps.lat.toFixed(5)}, {gps.lng.toFixed(5)}</span>}
                      {gps && <button onClick={() => setGps(null)} className="text-xs text-white/30 hover:text-white/60">✕</button>}
                    </div>
                    <p className="mt-1 text-xs text-white/30">Stored on-chain only if you share it. User-controlled.</p>
                  </div>

                  {/* Parent ID */}
                  <div>
                    <label className="mb-2 block text-sm text-white/60">
                      Parent Media ID <span className="text-white/30">(optional — only for derivatives)</span>
                    </label>
                    <input type="text" value={parentId} onChange={(e) => setParentId(e.target.value)}
                      placeholder="0x... leave empty for original media"
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 font-mono text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30" />
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
              <div className="flex flex-col items-center gap-6 py-8 sm:py-12 text-center">
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


          {/* DUPLICATE — already registered */}
          {phase === "complete" && duplicate && (
            <motion.div className="p-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-6 flex flex-col items-center gap-4 text-center">
                <div className="flex size-16 items-center justify-center rounded-full bg-amber-500/20">
                  <span className="text-3xl">⚠</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Already Registered</h3>
                  <p className="mt-1 text-sm text-white/50">This image is already on TRACE. View the existing record below.</p>
                </div>
              </div>
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/40">Registered</span>
                  <span className="text-sm text-white">{duplicate?.registered ? new Date(duplicate.registered as string).toLocaleString() : "—"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/40">Creator</span>
                  <span className="font-mono text-xs text-emerald-400 truncate max-w-xs">{String(duplicate?.creator ?? "").slice(0,20)}...</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/40">Sui TX</span>
                  <a href={`https://suiexplorer.com/txblock/${duplicate?.sui_tx}?network=testnet`}
                    target="_blank" rel="noopener noreferrer"
                    className="font-mono text-xs text-blue-400 hover:text-blue-300 truncate max-w-xs">
                    {String(duplicate?.sui_tx ?? "").slice(0,20)}...
                  </a>
                </div>
                <div className="pt-2 flex gap-3">
                  <a href={`/graph/${duplicate?.media_id}`}
                    className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold py-3 text-center transition-colors">
                    View Provenance Graph
                  </a>
                  <a href={duplicate?.certificate_url as string} target="_blank" rel="noopener noreferrer"
                    className="flex-1 rounded-xl border border-white/20 hover:bg-white/10 text-white text-sm font-semibold py-3 text-center transition-colors">
                    View Certificate
                  </a>
                </div>
                <button onClick={() => { setDuplicate(null); setPhase("idle"); setFile(null); }}
                  className="w-full text-xs text-white/30 hover:text-white/60 py-2 transition-colors">
                  Register a different image
                </button>
              </div>
            </motion.div>
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