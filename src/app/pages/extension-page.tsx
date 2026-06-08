import { motion } from "motion/react";
import { Chrome, Download, Shield, Eye, Zap, Lock, CheckCircle2, AlertTriangle, Sparkles, XCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router";
import { ExtensionPopup } from "../components/extension/ExtensionPopup";
import { ExtensionWorkflow } from "../components/extension/ExtensionWorkflow";
import { ExtensionFeatures } from "../components/extension/ExtensionFeatures";
import { ExtensionDownload } from "../components/extension/ExtensionDownload";

const EXTENSION_ZIP = "https://github.com/Trace-Protocol-co/trace-extension";

export function ExtensionPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Hero */}
      <section className="pt-24 pb-16 px-4 sm:px-6 text-center border-b border-border/50">
        <motion.div className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-border/50 bg-card/50 text-sm text-muted-foreground">
            <Chrome className="w-4 h-4 text-protocol" />
            Chrome Extension — Free
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6">
            Browser <span className="text-protocol">Extension</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Verify media authenticity across the web in real-time. See trust badges on every
            image and video — powered by Sui blockchain.
          </p>

          {/* Install instructions */}
          <div className="max-w-xl mx-auto mb-8 rounded-xl border border-border/50 bg-card/50 p-5 text-left">
            <div className="text-sm font-semibold text-foreground mb-3">Install in 3 steps:</div>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-protocol font-bold shrink-0">1.</span>
                <span>Download the extension zip below</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-protocol font-bold shrink-0">2.</span>
                <span>Go to <code className="text-xs bg-muted px-1.5 py-0.5 rounded">chrome://extensions</code> → enable <strong>Developer mode</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-protocol font-bold shrink-0">3.</span>
                <span>Click <strong>Load unpacked</strong> → select the extracted folder</span>
              </li>
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-protocol hover:bg-protocol/90 text-white w-full sm:w-auto"
              onClick={() => window.open(EXTENSION_ZIP, "_blank")}>
              <Download className="w-4 h-4 mr-2" />
              Download Extension (.zip)
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto"
              onClick={() => navigate("/verify")}>
              Verify Media Instead
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Badge legend */}
      <section className="py-12 px-4 sm:px-6 border-b border-border/50">
        <div className="max-w-4xl mx-auto">
          <motion.div className="text-center mb-8"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">What You'll See on Every Page</h2>
            <p className="text-muted-foreground text-sm">Color-coded badges appear automatically on all images and videos</p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: CheckCircle2, color: "#10b981", bg: "rgba(16,185,129,0.15)", label: "VERIFIED", desc: "Registered & authentic" },
              { icon: AlertTriangle, color: "#f59e0b", bg: "rgba(245,158,11,0.15)", label: "MODIFIED", desc: "Edited but traceable" },
              { icon: XCircle,      color: "#ef4444", bg: "rgba(239,68,68,0.15)",   label: "UNVERIFIED", desc: "Not in registry" },
              { icon: Sparkles,     color: "#8b5cf6", bg: "rgba(139,92,246,0.15)", label: "AI GENERATED", desc: "Synthetic content" },
            ].map((b) => (
              <motion.div key={b.label}
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-xl border border-border/50 p-4 text-center"
                style={{ background: b.bg }}>
                <b.icon className="w-8 h-8 mx-auto mb-2" style={{ color: b.color }} />
                <div className="text-xs font-bold mb-1" style={{ color: b.color }}>{b.label}</div>
                <div className="text-xs text-muted-foreground">{b.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popup Preview */}
      <section className="py-16 px-4 sm:px-6 border-b border-border/50">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-12"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Extension Popup</h2>
            <p className="text-muted-foreground text-sm">Click the TRACE icon in your toolbar — live scan history and stats</p>
          </motion.div>
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} className="flex-shrink-0">
              <ExtensionPopup />
            </motion.div>
            <motion.div className="max-w-sm space-y-5"
              initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}>
              {[
                { icon: Eye,    title: "Recent Scans",   desc: "See the last 10 images verified on any page you visited" },
                { icon: Zap,    title: "Live Stats",     desc: "Today's count of verified, modified, AI-generated media" },
                { icon: Shield, title: "Quick Verify",   desc: "Paste any URL for instant verification without leaving the page" },
                { icon: Lock,   title: "Zero Tracking",  desc: "All verification goes directly to blockchain. We never see your browsing." },
              ].map((f) => (
                <div key={f.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-protocol/10 flex items-center justify-center flex-shrink-0">
                    <f.icon className="w-5 h-5 text-protocol" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm mb-1">{f.title}</div>
                    <div className="text-xs text-muted-foreground">{f.desc}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 sm:px-6 border-b border-border/50">
        <div className="max-w-5xl mx-auto">
          <ExtensionWorkflow />
        </div>
      </section>

      {/* Features */}
      <section className="px-4 sm:px-6 border-b border-border/50">
        <div className="max-w-6xl mx-auto">
          <ExtensionFeatures />
        </div>
      </section>

      {/* Download CTA */}
      <ExtensionDownload />

      {/* Footer nav */}
      <section className="border-t border-border/50 py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-muted-foreground">
          <button onClick={() => navigate("/upload")} className="hover:text-foreground transition-colors">Register Media</button>
          <span className="hidden sm:block">·</span>
          <button onClick={() => navigate("/verify")} className="hover:text-foreground transition-colors">Verify a File</button>
          <span className="hidden sm:block">·</span>
          <button onClick={() => navigate("/explorer")} className="hover:text-foreground transition-colors">Explorer</button>
          <span className="hidden sm:block">·</span>
          <button onClick={() => navigate("/api")} className="hover:text-foreground transition-colors">API Docs</button>
        </div>
      </section>
    </div>
  );
}