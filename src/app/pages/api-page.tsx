import { motion } from "motion/react";
import { useState } from "react";
import { Code, Book, Key, Terminal, ExternalLink, Copy, Check } from "lucide-react";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

// ── Real endpoints matching our actual backend ────────────────────────────────
const codeExamples = {
  verify: `// Verify media authenticity
const formData = new FormData();
formData.append('file', mediaFile);

const response = await fetch('http://localhost:3001/v1/verify', {
  method: 'POST',
  body: formData,
});

const result = await response.json();
// result.verdict: 'VERIFIED_ORIGINAL' | 'MODIFIED' | 'UNVERIFIED' | 'AI_GENERATED'
// result.confidence: 0.94
// result.origin.sui_tx: 'AkqZFLHhH4f9Rbb...'
// result.origin.walrus_blob: '5Dg0ozoy7c5JkEs...'
// result.provenance_chain: [ { node, type, integrity, timestamp } ]`,

  upload: `// Upload and register original media
const formData = new FormData();
formData.append('file', mediaFile);
formData.append('edit_type', '0');           // 0 = ORIGINAL
formData.append('ai_score', '0');            // 0–10000 basis points
formData.append('description', 'Lagos protest footage — original capture');
// For derivatives, add:
// formData.append('parent_id', '0x8ff84eec...');
// formData.append('edit_type', '1');        // 1 = TRIM

const response = await fetch('http://localhost:3001/v1/register', {
  method: 'POST',
  body: formData,
});

const result = await response.json();
// result.media_id: '0x8ff84eec6637d866...'
// result.sui_tx: 'AkqZFLHhH4f9Rbbk...'
// result.walrus_blob: '5Dg0ozoy7c5JkEsT...'
// result.certificate_url: 'https://walruscan.com/testnet/blob/...'`,

  provenance: `// Get provenance graph for any media ID
const response = await fetch(
  'http://localhost:3001/v1/media/0x8ff84eec6637d866.../graph'
);

const graph = await response.json();
// graph.nodes: [
//   { mediaId, integrity, creator, timestamp, blobId, suiTx, aiScore, revoked }
// ]
// graph.edges: [
//   { from: '0x8ff8...', to: '0x1469...', type: 'DECLARED' }
// ]

// integrity values:
// 0 = ORIGINAL  1 = MODIFIED  2 = UNVERIFIED  3 = AI_GENERATED`,
};

const endpoints = [
  { method: "POST", path: "/v1/register",        description: "Register original or derivative media on-chain" },
  { method: "POST", path: "/v1/verify",           description: "Verify authenticity of any media file" },
  { method: "GET",  path: "/v1/media/:id",        description: "Get full MediaRecord by Sui object ID" },
  { method: "GET",  path: "/v1/media/:id/graph",  description: "Get provenance DAG for a media ID" },
  { method: "GET",  path: "/v1/search",           description: "Search by SHA-256 hash or pHash similarity" },
  { method: "GET",  path: "/v1/health",           description: "Server health, network, and registry stats" },
];

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      size="sm"
      variant="outline"
      className="border-white/20 bg-white/5 text-white hover:bg-white/10"
      onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
    >
      {copied ? <><Check className="mr-1.5 size-3.5" />Copied</> : <><Copy className="mr-1.5 size-3.5" />Copy Code</>}
    </Button>
  );
}

export function ApiPage() {
  const [activeTab, setActiveTab] = useState("verify");

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-20">

        {/* Header */}
        <motion.div
          className="mb-12 sm:mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 sm:px-4 py-1.5 sm:py-2 backdrop-blur-sm">
            <Code className="size-4 text-white/70" />
            <span className="text-xs sm:text-sm text-white/70">Developer API</span>
          </div>
          <h1 className="mb-4 text-3xl sm:text-5xl lg:text-6xl font-bold text-white">
            Build with{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              TRACE
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-base sm:text-xl text-white/60 px-4 sm:px-0">
            Integrate media authenticity verification into your applications with our
            developer-friendly REST API
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">

          {/* Sidebar */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {/* Quick start links */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-5 sm:p-6 backdrop-blur-sm">
              <h3 className="mb-4 font-semibold text-white">Quick Start</h3>
              <ul className="space-y-3">
                {[
                  { icon: Book,         label: "Getting Started" },
                  { icon: Key,          label: "Authentication" },
                  { icon: Terminal,     label: "Code Examples" },
                  { icon: ExternalLink, label: "API Reference" },
                ].map(({ icon: Icon, label }) => (
                  <li key={label}>
                    <a href="#" className="flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white">
                      <Icon className="size-4 shrink-0" />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Get API key CTA */}
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 sm:p-6 backdrop-blur-sm">
              <h3 className="mb-2 font-semibold text-white">Get API Key</h3>
              <p className="mb-4 text-sm text-white/70">
                Start building with the TRACE API in minutes
              </p>
              <Button className="w-full bg-white text-black hover:bg-white/90 font-semibold">
                Generate API Key
              </Button>
            </div>

            {/* Endpoints */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-5 sm:p-6 backdrop-blur-sm">
              <h3 className="mb-4 font-semibold text-white">API Endpoints</h3>
              <div className="space-y-3">
                {endpoints.map((endpoint) => (
                  <div key={endpoint.path} className="text-sm">
                    <div className="mb-1 flex items-center gap-2 flex-wrap">
                      <span className={`rounded px-2 py-0.5 font-mono text-xs font-semibold shrink-0 ${
                        endpoint.method === "GET"
                          ? "bg-sky-500/20 text-sky-400"
                          : "bg-emerald-500/20 text-emerald-400"
                      }`}>
                        {endpoint.method}
                      </span>
                      <span className="font-mono text-xs text-white/70 break-all">{endpoint.path}</span>
                    </div>
                    <p className="text-white/50 text-xs">{endpoint.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Code examples */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="rounded-2xl border border-white/10 bg-black shadow-2xl">
              {/* Terminal chrome */}
              <div className="border-b border-white/10 bg-white/5 px-4 sm:px-6 py-4 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-red-500" />
                  <div className="size-3 rounded-full bg-amber-500" />
                  <div className="size-3 rounded-full bg-emerald-500" />
                  <h2 className="ml-3 text-sm sm:text-base font-semibold text-white">Code Examples</h2>
                </div>
              </div>

              <Tabs defaultValue="verify" className="p-4 sm:p-6" onValueChange={setActiveTab}>
                <TabsList className="mb-6 grid w-full grid-cols-3 bg-white/5">
                  <TabsTrigger value="verify" className="text-xs sm:text-sm">Verify Media</TabsTrigger>
                  <TabsTrigger value="upload" className="text-xs sm:text-sm">Upload Media</TabsTrigger>
                  <TabsTrigger value="provenance" className="text-xs sm:text-sm">Get Provenance</TabsTrigger>
                </TabsList>

                {(["verify", "upload", "provenance"] as const).map((tab) => (
                  <TabsContent key={tab} value={tab}>
                    <div className="rounded-xl bg-zinc-950 p-3 sm:p-5">
                      <pre className="overflow-x-auto text-xs sm:text-sm leading-relaxed">
                        <code className="text-white/80">{codeExamples[tab]}</code>
                      </pre>
                    </div>
                  </TabsContent>
                ))}

                <div className="mt-4 border-t border-white/10 pt-4 flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-white/60">Response Format: JSON</span>
                  <CopyButton code={codeExamples[activeTab as keyof typeof codeExamples]} />
                </div>
              </Tabs>
            </div>

            {/* Feature cards */}
            <div className="mt-6 sm:mt-8 grid gap-3 sm:gap-4 grid-cols-2">
              {[
                { icon: Key,          title: "No Auth Required",   description: "Public verify and search endpoints need no API key" },
                { icon: Terminal,     title: "RESTful Design",      description: "Standard HTTP methods and JSON responses" },
                { icon: Code,         title: "Real On-Chain Data",  description: "Every registration creates a real Sui transaction" },
                { icon: ExternalLink, title: "Walrus Storage",      description: "Media blobs stored on decentralized Walrus nodes" },
              ].map((feature) => (
                <div key={feature.title} className="rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4 backdrop-blur-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <feature.icon className="size-4 sm:size-5 shrink-0 text-emerald-500" />
                    <h3 className="text-xs sm:text-sm font-semibold text-white">{feature.title}</h3>
                  </div>
                  <p className="text-xs text-white/60">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* SDKs */}
            <div className="mt-6 sm:mt-8 rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-8 backdrop-blur-sm">
              <h2 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-semibold text-white">Official SDKs</h2>
              <div className="grid gap-3 sm:gap-4 grid-cols-3">
                {[
                  { name: "JavaScript", status: "Live" },
                  { name: "Python",     status: "Soon" },
                  { name: "Go",         status: "Soon" },
                ].map((sdk) => (
                  <div key={sdk.name} className="rounded-xl border border-white/10 bg-black/50 p-3 sm:p-4 text-center">
                    <div className="mb-1 sm:mb-2 text-base sm:text-2xl font-bold text-white">{sdk.name}</div>
                    <div className={`text-xs font-mono mb-1 sm:mb-2 ${sdk.status === "Live" ? "text-emerald-400" : "text-white/30"}`}>
                      {sdk.status}
                    </div>
                    <a href="#" className="text-xs text-emerald-400 hover:underline">
                      View Docs →
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="flex-1 border-white/20 bg-white/5 text-white hover:bg-white/10"
                onClick={() => window.open("https://github.com", "_blank")}
              >
                <ExternalLink className="mr-2 size-4" />
                View on GitHub
              </Button>
              <Button
                className="flex-1 bg-white text-black hover:bg-white/90 font-semibold"
                onClick={() => window.location.href = "/verify"}
              >
                Try the API Live
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}