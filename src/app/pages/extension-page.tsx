import { motion } from "motion/react";
import { ExtensionPopup } from "../components/extension/ExtensionPopup";
import { ExtensionDownload } from "../components/extension/ExtensionDownload";
import { ExtensionFeatures } from "../components/extension/ExtensionFeatures";
import { ExtensionWorkflow } from "../components/extension/ExtensionWorkflow";
import { ExtensionBadge } from "../components/extension/ExtensionBadge";
import { useNavigate } from "react-router";

export function ExtensionPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">

      {/* Hero */}
      <section className="py-20 px-4 sm:px-6 text-center border-b border-border/50">
        <motion.div className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl sm:text-6xl font-bold mb-6">
            Verify Media{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Everywhere
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            The TRACE browser extension automatically verifies every image and video
            you see online — powered by Sui blockchain and Walrus decentralized storage.
          </p>

          {/* Badge preview */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {(["verified", "modified", "unverified", "ai-generated"] as const).map((status) => (
              <div key={status} className="relative">
                <ExtensionBadge status={status} size="lg" showLabel position="top-right" />
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Live Popup Preview */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-12"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Extension Preview</h2>
            <p className="text-muted-foreground">Exactly what you see when you click the TRACE icon</p>
          </motion.div>
          <div className="flex justify-center">
            <ExtensionPopup />
          </div>
        </div>
      </section>

      {/* How it works */}
      <ExtensionWorkflow />

      {/* Features */}
      <ExtensionFeatures />

      {/* Download CTA */}
      <ExtensionDownload />

      {/* Footer CTA links */}
      <section className="border-t border-border/50 py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
          <button onClick={() => navigate("/upload")}
            className="hover:text-foreground transition-colors">
            Register Media →
          </button>
          <span className="hidden sm:block">·</span>
          <button onClick={() => navigate("/verify")}
            className="hover:text-foreground transition-colors">
            Verify a File →
          </button>
          <span className="hidden sm:block">·</span>
          <button onClick={() => navigate("/explorer")}
            className="hover:text-foreground transition-colors">
            Explorer →
          </button>
          <span className="hidden sm:block">·</span>
          <button onClick={() => navigate("/api")}
            className="hover:text-foreground transition-colors">
            API Docs →
          </button>
        </div>
      </section>
    </div>
  );
}