import { motion } from "motion/react";
import { Chrome, Download } from "lucide-react";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router";
import { ExtensionPopup } from "../components/extension/ExtensionPopup";
import { ExtensionWorkflow } from "../components/extension/ExtensionWorkflow";
import { SocialMediaMock } from "../components/extension/SocialMediaMock";
import { TwitterDeepfakeDemo } from "../components/extension/TwitterDeepfakeDemo";

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
          <h1 className="text-5xl sm:text-7xl font-bold mb-6">
            Verify Media{" "}
            <span className="text-protocol">Everywhere</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            The TRACE browser extension automatically verifies every image and video
            you encounter online — powered by Sui blockchain and Walrus decentralized storage.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" className="bg-protocol hover:bg-protocol/90 text-white">
              <Download className="w-4 h-4 mr-2" />
              Add to Chrome — Free
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/verify")}>
              Verify a File Instead
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Extension Popup Preview — what judges see when they click the icon */}
      <section className="py-20 px-4 sm:px-6 border-b border-border/50">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-12"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Extension Popup</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Click the TRACE icon in your Chrome toolbar — this is exactly what you'll see.
              Recent scans, live stats, and quick verify all in one place.
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row items-start justify-center gap-16">
            {/* Popup — rendered exactly as it appears in Chrome */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex-shrink-0"
            >
              <div className="mb-4 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border/50 text-xs text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-verified animate-pulse" />
                  Live Preview
                </div>
              </div>
              <ExtensionPopup />
              <p className="mt-4 text-center text-xs text-muted-foreground">
                ↑ This is the actual popup that opens when you click the TRACE icon
              </p>
            </motion.div>

            {/* Feature breakdown */}
            <motion.div className="max-w-sm space-y-8 pt-4"
              initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}>
              <div>
                <h3 className="font-bold text-lg mb-2">Recent Scans</h3>
                <p className="text-sm text-muted-foreground">
                  See your last 10 verified images and videos with status, source, and timestamp.
                  Click any entry to view full provenance details.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Quick Verify</h3>
                <p className="text-sm text-muted-foreground">
                  Paste any URL or drop an image file directly into the popup for instant
                  verification without leaving your current page.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Today's Stats</h3>
                <p className="text-sm text-muted-foreground">
                  Track how much media you've encountered is verified, modified, unverified,
                  or AI-generated. Your personal trust score updates in real-time.
                </p>
              </div>
              <div className="flex gap-3">
                <Button size="sm" onClick={() => navigate("/upload")} variant="outline" className="flex-1">
                  Register Media
                </Button>
                <Button size="sm" onClick={() => navigate("/explorer")} variant="outline" className="flex-1">
                  Explorer
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 sm:px-6 border-b border-border/50">
        <div className="max-w-7xl mx-auto">
          <ExtensionWorkflow />
        </div>
      </section>

      {/* Twitter Deepfake Demo */}
      <section className="py-20 px-4 sm:px-6 border-b border-border/50">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-12"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Catching Deepfakes in the Wild
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Watch TRACE scan a tweet in real-time and detect AI-generated content before you share it.
            </p>
          </motion.div>
          <TwitterDeepfakeDemo />
        </div>
      </section>

      {/* Social Media Mock */}
      <section className="py-20 px-4 sm:px-6 border-b border-border/50">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-12"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Trust Badges Across the Web
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              TRACE badges appear automatically on every social media post, news article,
              and webpage with media content.
            </p>
          </motion.div>
          <SocialMediaMock />
        </div>
      </section>

      {/* Footer nav */}
      <section className="py-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <button onClick={() => navigate("/upload")} className="hover:text-foreground transition-colors">Register Media →</button>
          <span>·</span>
          <button onClick={() => navigate("/verify")} className="hover:text-foreground transition-colors">Verify a File →</button>
          <span>·</span>
          <button onClick={() => navigate("/explorer")} className="hover:text-foreground transition-colors">Explorer →</button>
          <span>·</span>
          <button onClick={() => navigate("/api")} className="hover:text-foreground transition-colors">API Docs →</button>
        </div>
      </section>
    </div>
  );
}