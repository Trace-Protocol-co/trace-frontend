import { motion } from "motion/react";
import { useState } from "react";
import { Code, Key, Terminal, ExternalLink, Copy, Check, Clock } from "lucide-react";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

const API_BASE = "https://trace-cbvb.onrender.com";

const codeExamples = {
  verify: `// Verify media authenticity — no auth required (testnet preview)
const formData = new FormData();
formData.append('file', mediaFile);

const response = await fetch('${API_BASE}/v1/verify', {
  method: 'POST',
  body: formData,
});

const result = await response.json();
// result.verdict: 'VERIFIED_ORIGINAL' | 'MODIFIED' | 'UNVERIFIED' | 'AI_GENERATED'
// result.confidence: 0.94
// result.origin.creator: '0x7a9f...c4d2'
// result.origin.sui_tx: 'AkqZFLHhH4f9Rbb...'
// result.provenance_chain: [ { node, type, integrity, timestamp } ]`,

  upload: `// Register media — Google zkLogin required (testnet preview)
const formData = new FormData();
formData.append('file', mediaFile);
formData.append('edit_type', '0');           // 0 = ORIGINAL
formData.append('ai_score', '0');            // 0–10000 basis points
formData.append('description', 'Lagos protest footage — original capture');
formData.append('creator_address', zkLoginAddress);
formData.append('creator_email', userEmail);

const response = await fetch('${API_BASE}/v1/register', {
  method: 'POST',
  body: formData,
});

const result = await response.json();
// result.media_id: '0x8ff84eec6637d866...'
// result.sui_tx: 'AkqZFLHhH4f9Rbbk...'
// result.walrus_blob: '5Dg0ozoy7c5JkEsT...'
// result.certificate_url: 'https://walruscan.com/testnet/blob/...'`,

  provenance: `// Get provenance graph — no auth required (testnet preview)
const response = await fetch(
  '${API_BASE}/v1/media/0x8ff84eec6637d866.../graph'
);

const graph = await response.json();
// graph.nodes: [ { mediaId, integrity, creator, timestamp } ]
// graph.edges: [ { from, to, type: 'DECLARED' } ]

// integrity: 0=ORIGINAL 1=MODIFIED 2=UNVERIFIED 3=AI_GENERATED`,
};

const endpoints = [
  { method: "POST", path: "/v1/register",              description: "Register original or derivative media on-chain", auth: true },
  { method: "POST", path: "/v1/verify",                description: "Verify authenticity of any media file", auth: false },
  { method: "GET",  path: "/v1/media/:id",             description: "Get full MediaRecord by Sui object ID", auth: false },
  { method: "GET",  path: "/v1/media/:id/graph",       description: "Get provenance DAG for a media ID", auth: false },
  { method: "GET",  path: "/v1/media/:id/certificate", description: "HTML certificate with QR code", auth: false },
  { method: "GET",  path: "/v1/explorer",              description: "Browse all registered media", auth: false },
  { method: "GET",  path: "/v1/search",                description: "Search by hash or pHash similarity", auth: false },
  { method: "GET",  path: "/v1/health",                description: "Server health and registry stats", auth: false },
];

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button size="sm" variant="outline"
      className="border-white/20 bg-white/5 text-white hover:bg-white/10"
      onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500); }}>
      {copied ? <><Check className="mr-1.5 size-3.5" />Copied</> : <><Copy className="mr-1.5 size-3.5" />Copy</>}
    </Button>
  );
}

export function ApiPage() {
  const [activeTab, setActiveTab] = useState("verify");

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-20">

        {/* Header */}
        <motion.div className="mb-12 sm:mb-16 text-center"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
            <Code className="size-4 text-white/70" />
            <span className="text-sm text-white/70">Developer API</span>
          </div>
          <h1 className="mb-4 text-4xl sm:text-6xl font-bold text-white">
            Build with{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">TRACE</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-white/60">
            Integrate media authenticity verification into your applications.
            Public API launching soon — testnet preview available now.
          </p>

          {/* Coming Soon banner */}
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm text-amber-400">
            <Clock className="size-4" />
            Public API — Coming Soon · Testnet preview at {API_BASE}
          </div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">

          {/* Sidebar */}
          <motion.div className="space-y-4"
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>

            {/* Notify me CTA */}
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="size-4 text-amber-400" />
                <h3 className="font-semibold text-white">Coming Soon</h3>
              </div>
              <p className="text-sm text-white/60 mb-4">
                API key management, usage analytics, billing, and mainnet deployment launching soon.
              </p>
              <Button className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold" disabled>
                Notify Me on Launch
              </Button>
            </div>

            {/* Auth model */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h3 className="mb-3 font-semibold text-white">Auth Model</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 text-emerald-400">✓</span>
                  <div>
                    <div className="text-white font-medium">Verify / Read</div>
                    <div className="text-white/50 text-xs">Always free, no auth required</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 text-amber-400">⚿</span>
                  <div>
                    <div className="text-white font-medium">Register / Write</div>
                    <div className="text-white/50 text-xs">Google zkLogin required — identity anchored on-chain</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Testnet endpoints */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h3 className="mb-4 font-semibold text-white">Testnet Endpoints</h3>
              <div className="space-y-3">
                {endpoints.map((ep) => (
                  <div key={ep.path} className="text-sm">
                    <div className="mb-1 flex items-center gap-2 flex-wrap">
                      <span className={`rounded px-2 py-0.5 font-mono text-xs font-semibold shrink-0 ${
                        ep.method === "GET" ? "bg-sky-500/20 text-sky-400" : "bg-emerald-500/20 text-emerald-400"
                      }`}>{ep.method}</span>
                      <span className="font-mono text-xs text-white/70 break-all">{ep.path}</span>
                      {ep.auth && <span className="text-[10px] text-amber-400 border border-amber-400/30 rounded px-1">auth</span>}
                    </div>
                    <p className="text-white/40 text-xs">{ep.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* What's coming */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h3 className="mb-3 font-semibold text-white">What's Coming</h3>
              <div className="space-y-2 text-sm text-white/40">
                <div className="flex items-center gap-2"><Clock className="size-3" /> API key management</div>
                <div className="flex items-center gap-2"><Clock className="size-3" /> Usage analytics & billing</div>
                <div className="flex items-center gap-2"><Clock className="size-3" /> Webhook notifications</div>
                <div className="flex items-center gap-2"><Clock className="size-3" /> Python & Go SDKs</div>
                <div className="flex items-center gap-2"><Clock className="size-3" /> Mainnet deployment</div>
                <div className="flex items-center gap-2"><Clock className="size-3" /> Rate limiting & quotas</div>
              </div>
            </div>
          </motion.div>

          {/* Code examples */}
          <motion.div className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>

            <div className="rounded-2xl border border-white/10 bg-black shadow-2xl">
              <div className="border-b border-white/10 bg-white/5 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-red-500" />
                  <div className="size-3 rounded-full bg-amber-500" />
                  <div className="size-3 rounded-full bg-emerald-500" />
                  <h2 className="ml-3 font-semibold text-white">Testnet Preview</h2>
                </div>
                <span className="text-xs text-amber-400 border border-amber-400/30 rounded-full px-3 py-1">Preview Only</span>
              </div>

              <Tabs defaultValue="verify" className="p-6" onValueChange={setActiveTab}>
                <TabsList className="mb-6 grid w-full grid-cols-3 bg-white/5">
                  <TabsTrigger value="verify">Verify</TabsTrigger>
                  <TabsTrigger value="upload">Register</TabsTrigger>
                  <TabsTrigger value="provenance">Provenance</TabsTrigger>
                </TabsList>

                {(["verify", "upload", "provenance"] as const).map((tab) => (
                  <TabsContent key={tab} value={tab}>
                    <div className="rounded-xl bg-zinc-950 p-5">
                      <pre className="overflow-x-auto text-xs sm:text-sm leading-relaxed">
                        <code className="text-white/80">{codeExamples[tab]}</code>
                      </pre>
                    </div>
                  </TabsContent>
                ))}

                <div className="mt-4 border-t border-white/10 pt-4 flex items-center justify-between">
                  <span className="text-sm text-white/60">Response: JSON</span>
                  <CopyButton code={codeExamples[activeTab as keyof typeof codeExamples]} />
                </div>
              </Tabs>
            </div>

            {/* SDKs — all coming soon except JS preview */}
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-xl font-semibold text-white">SDKs</h2>
                <span className="text-xs text-amber-400 border border-amber-400/30 rounded-full px-3 py-1">Coming Soon</span>
              </div>
              <div className="grid gap-4 grid-cols-3">
                {[
                  { name: "JavaScript", status: "Preview",     color: "text-emerald-400" },
                  { name: "Python",     status: "Coming Soon", color: "text-white/30" },
                  { name: "Go",         status: "Coming Soon", color: "text-white/30" },
                ].map((sdk) => (
                  <div key={sdk.name} className="rounded-xl border border-white/10 bg-black/50 p-4 text-center">
                    <div className="mb-2 text-xl font-bold text-white">{sdk.name}</div>
                    <div className={`text-xs font-mono mb-2 ${sdk.color}`}>{sdk.status}</div>
                    <span className="text-xs text-white/20">
                      {sdk.status === "Preview" ? "testnet only" : "notify me"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature cards */}
            <div className="mt-6 grid gap-4 grid-cols-2">
              {[
                { icon: Key,          title: "No Auth to Verify",  desc: "Public read endpoints — no API key needed" },
                { icon: Terminal,     title: "RESTful Design",      desc: "Standard HTTP + JSON, easy to integrate" },
                { icon: Code,         title: "Real On-Chain Data",  desc: "Every registration is a real Sui transaction" },
                { icon: ExternalLink, title: "Walrus Storage",      desc: "Media stored on decentralized Walrus nodes" },
              ].map((f) => (
                <div key={f.title} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <f.icon className="size-4 text-emerald-500 shrink-0" />
                    <h3 className="text-sm font-semibold text-white">{f.title}</h3>
                  </div>
                  <p className="text-xs text-white/60">{f.desc}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="flex-1 border-white/20 bg-white/5 text-white hover:bg-white/10"
                onClick={() => window.open("https://github.com", "_blank")}>
                <ExternalLink className="mr-2 size-4" />
                View on GitHub
              </Button>
              <Button className="flex-1 bg-white text-black hover:bg-white/90 font-semibold"
                onClick={() => window.location.href = "/verify"}>
                Try Verify Now — Free
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}