import { motion } from "motion/react";
import { Chrome, Download, Star, Users, Shield, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/button";

export function ExtensionDownload() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          {/* Main Download Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-protocol/20 via-verified/10 to-ai-generated/20 rounded-3xl border border-protocol/30 p-12 text-center mb-8">
            <motion.div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
                                 radial-gradient(circle at 80% 50%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)`,
              }}
            />
            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-protocol/30 backdrop-blur-xl border border-protocol/50 flex items-center justify-center"
              >
                <Chrome className="w-10 h-10 text-protocol" />
              </motion.div>
              <h2 className="text-4xl font-bold mb-4">Download TRACE Extension</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Start verifying media authenticity across the web. Free, open-source, and privacy-first.
              </p>
              <div className="flex flex-wrap gap-4 justify-center mb-8">
                <Button size="lg" className="bg-protocol hover:bg-protocol/90 text-white text-base px-8">
                  <Download className="w-5 h-5 mr-2" />
                  Add to Chrome
                </Button>
                <Button size="lg" variant="outline" className="text-base px-8">
                  View on GitHub
                </Button>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-modified fill-modified" />
                  <span>4.9/5 Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-verified" />
                  <span>100K+ Users</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-protocol" />
                  <span>Privacy-First</span>
                </div>
              </div>
            </div>
          </div>

          {/* Browser Compatibility */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-4 mb-8"
          >
            <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-xl p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-verified/20 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-verified" />
              </div>
              <h3 className="font-semibold mb-2">Chrome & Chromium</h3>
              <p className="text-sm text-muted-foreground mb-2">Fully supported</p>
              <p className="text-xs text-muted-foreground">Version 90+</p>
            </div>

            <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-xl p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-verified/20 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-verified" />
              </div>
              <h3 className="font-semibold mb-2">Edge</h3>
              <p className="text-sm text-muted-foreground mb-2">Fully supported</p>
              <p className="text-xs text-muted-foreground">Version 90+</p>
            </div>

            <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-xl p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-modified/20 flex items-center justify-center">
                <Chrome className="w-6 h-6 text-modified" />
              </div>
              <h3 className="font-semibold mb-2">Brave</h3>
              <p className="text-sm text-muted-foreground mb-2">Fully supported</p>
              <p className="text-xs text-muted-foreground">Version 1.30+</p>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-4"
          >
            <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-xl p-6">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-verified" />
                Security & Privacy
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-verified">✓</span>
                  <span>No data collection or tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-verified">✓</span>
                  <span>Open-source and auditable</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-verified">✓</span>
                  <span>Direct blockchain queries only</span>
                </li>
              </ul>
            </div>

            <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-xl p-6">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Download className="w-4 h-4 text-protocol" />
                Installation
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-protocol">1.</span>
                  <span>Click "Add to Chrome" button</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-protocol">2.</span>
                  <span>Confirm installation in browser</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-protocol">3.</span>
                  <span>Start browsing - verification is automatic</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Coming Soon */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-8 p-6 rounded-xl bg-gradient-to-r from-ai-generated/10 to-protocol/10 border border-ai-generated/20 text-center"
          >
            <h4 className="font-semibold mb-2">Coming Soon</h4>
            <p className="text-sm text-muted-foreground">
              Firefox and Safari extensions are in development. Join our waitlist to get notified.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
