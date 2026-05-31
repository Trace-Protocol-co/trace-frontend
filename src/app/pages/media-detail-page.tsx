import { useParams, useNavigate } from "react-router";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { ExternalLink, ArrowLeft, Shield, FileText } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

const INTEGRITY_CONFIG = {
  0: { color: "bg-emerald-500", text: "text-emerald-400", label: "VERIFIED ORIGINAL" },
  1: { color: "bg-amber-500",   text: "text-amber-400",   label: "MODIFIED" },
  2: { color: "bg-red-500",     text: "text-red-400",     label: "UNVERIFIED" },
  3: { color: "bg-violet-500",  text: "text-violet-400",  label: "AI GENERATED" },
} as const;

const EDIT_LABELS: Record<number, string> = {
  0: "ORIGINAL", 1: "TRIM", 2: "COLOR GRADE", 3: "SUBTITLE",
  4: "AI REMIX",  5: "CROP", 6: "MERGE",       7: "TRANSLATE",
};

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className="font-mono text-[10px] text-white/30 hover:text-white/60 transition-colors shrink-0">
      {copied ? "✓" : "COPY"}
    </button>
  );
}

function Row({ label, value, link, mono = true }: { label: string; value: string; link?: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-white/5 last:border-0">
      <span className="text-xs text-white/40 shrink-0 w-32">{label}</span>
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {link
          ? <a href={link} target="_blank" rel="noopener noreferrer"
              className={`${mono ? "font-mono" : ""} text-xs text-cyan-400 hover:underline truncate`}>{value}</a>
          : <span className={`${mono ? "font-mono" : ""} text-xs text-white/70 break-all`}>{value}</span>
        }
        <CopyBtn text={value} />
      </div>
    </div>
  );
}

export function MediaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [media, setMedia] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    fetch(`${API}/v1/media/${id}`)
      .then((r) => r.json())
      .then((d) => { setMedia(d); setLoading(false); })
      .catch(() => { setError("Failed to load media record"); setLoading(false); });
  }, [id]);

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="size-12 animate-spin rounded-full border-4 border-white/10 border-t-emerald-500" />
    </div>
  );

  if (error || !media) return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black text-white">
      <Shield className="size-12 text-red-500" />
      <p className="font-mono text-sm text-white/60">{error || "Media not found"}</p>
      <Button onClick={() => navigate(-1)} variant="outline" className="border-white/20 text-white">Go Back</Button>
    </div>
  );

  const integrity = (media.integrity as number) ?? 2;
  const cfg = INTEGRITY_CONFIG[integrity as keyof typeof INTEGRITY_CONFIG] ?? INTEGRITY_CONFIG[2];

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

          <button onClick={() => navigate(-1)}
            className="mb-8 flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
            <ArrowLeft className="size-4" /> Back
          </button>

          <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="mb-2 text-2xl sm:text-3xl font-bold text-white">
                {String(media.description || "Untitled Media")}
              </h1>
              <div className="font-mono text-xs text-white/40 break-all">{String(media.mediaId || id)}</div>
            </div>
            <Badge className={`${cfg.color} border-0 text-white shrink-0`}>{cfg.label}</Badge>
          </div>

          {media.revoked && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/5 p-4 font-mono text-sm text-red-400">
              ⚠ This record has been revoked by the creator
            </div>
          )}

          {/* Core details */}
          <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4 sm:p-6">
            <h2 className="mb-4 font-semibold text-white">Provenance Details</h2>
            <Row label="Media ID"      value={String(media.mediaId || "")} />
            <Row label="Creator"       value={String(media.creator || "")} />
            <Row label="Timestamp"     value={new Date(Number(media.timestamp)).toLocaleString()} mono={false} />
            <Row label="Edit Type"     value={EDIT_LABELS[Number(media.editType)] ?? "UNKNOWN"} mono={false} />
            <Row label="AI Score"      value={`${((Number(media.aiScore) || 0) / 100).toFixed(1)}% synthetic`} mono={false} />
            <Row label="Revoked"       value={media.revoked ? "YES" : "NO"} mono={false} />
          </div>

          {/* On-chain data */}
          <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4 sm:p-6">
            <h2 className="mb-4 font-semibold text-white">On-Chain Data</h2>
            <Row label="Sui TX"     value={String(media.suiTx || "")}
              link={`https://suiexplorer.com/txblock/${media.suiTx}?network=testnet`} />
            <Row label="Walrus Blob" value={String(media.blobId || "")}
              link={`https://walruscan.com/testnet/blob/${media.blobId}`} />
            <Row label="SHA-256"    value={String(media.contentHash || "")} />
            <Row label="pHash"      value={String(media.perceptualHash || "")} />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="flex-1 bg-white text-black hover:bg-white/90 font-semibold"
              onClick={() => window.open(`/v1/media/${id}/certificate`, "_blank")}>
              <FileText className="mr-2 size-4" />
              View Certificate
            </Button>
            <Button variant="outline" className="flex-1 border-white/20 bg-white/5 text-white hover:bg-white/10"
              onClick={() => navigate(`/graph/${id}`)}>
              View Provenance Graph
            </Button>
            <Button variant="outline" className="flex-1 border-white/20 bg-white/5 text-white hover:bg-white/10"
              onClick={() => window.open(`https://suiexplorer.com/object/${id}?network=testnet`, "_blank")}>
              <ExternalLink className="mr-2 size-4" />
              Sui Explorer
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}