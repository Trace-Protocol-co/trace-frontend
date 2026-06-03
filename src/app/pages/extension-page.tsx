import { motion } from "motion/react";
import { Chrome, Download } from "lucide-react";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router";
import { ExtensionPopup } from "../components/extension/ExtensionPopup";
import { ExtensionWorkflow } from "../components/extension/ExtensionWorkflow";
import { ExtensionFeatures } from "../components/extension/ExtensionFeatures";
import { ExtensionDownload } from "../components/extension/ExtensionDownload";
import { ExtensionNotifications } from "../components/extension/ExtensionNotifications";
import { ContextMenuDemo } from "../components/extension/ContextMenuDemo";
import { TwitterDeepfakeDemo } from "../components/extension/TwitterDeepfakeDemo";
import { ExtensionBadge } from "../components/extension/ExtensionBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

export function ExtensionPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Hero */}
      <section className="pt-24 pb-16 px-4 sm:px-6 text-center">
        <motion.div className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 mb-6">
            <Chrome className="w-8 h-8 text-protocol" />
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold mb-6">
            Browser <span className="text-protocol">Extension</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Verify media authenticity across the web in real-time. See trust badges, detect
            deepfakes, and explore provenance without leaving your browser.
          </p>
          <Button size="lg" className="bg-protocol hover:bg-protocol/90 text-white">
            <Download className="w-4 h-4 mr-2" />
            Add to Chrome
          </Button>
        </motion.div>
      </section>

      {/* See It In Action — Twitter Deepfake Demo */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div className="text-center mb-12"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-bold mb-3">See It In Action</h2>
            <p className="text-muted-foreground">Watch TRACE automatically detect AI-generated content on Twitter in real-time</p>
          </motion.div>
          <TwitterDeepfakeDemo />
          <p className="text-center text-xs text-muted-foreground mt-4">
            Live demo showing automatic deepfake detection • Scanning happens in &lt;100ms • 92% confidence AI-generated
          </p>
        </div>
      </section>

      {/* Extension Popup Tabs Section — matches screenshot exactly */}
      <section className="py-16 px-4 sm:px-6 border-t border-border/50">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="popup">
            <TabsList className="w-full grid grid-cols-4 mb-12 rounded-full bg-card/50 border border-border/50 p-1">
              <TabsTrigger value="popup" className="rounded-full">Extension Popup</TabsTrigger>
              <TabsTrigger value="auto" className="rounded-full">Auto-Verification</TabsTrigger>
              <TabsTrigger value="full" className="rounded-full">Full Verification</TabsTrigger>
              <TabsTrigger value="settings" className="rounded-full">Settings</TabsTrigger>
            </TabsList>

            {/* Extension Popup Tab */}
            <TabsContent value="popup">
              <div className="grid lg:grid-cols-2 gap-16 items-start">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                  <h2 className="text-3xl font-bold mb-4">Extension Popup</h2>
                  <p className="text-muted-foreground mb-8">
                    Click the TRACE icon in your browser toolbar to see your verification history,
                    quick stats, and perform instant media checks.
                  </p>
                  <div className="space-y-6">
                    {[
                      { color: "bg-verified", title: "Recent Scans", desc: "View your last 10 verified images and videos" },
                      { color: "bg-protocol", title: "Quick Verify", desc: "Paste any URL or upload file for instant verification" },
                      { color: "bg-ai-generated", title: "Today's Stats", desc: "Track authenticity metrics for media you've encountered" },
                    ].map((item) => (
                      <div key={item.title} className="flex items-start gap-4">
                        <div className={`w-2 h-2 rounded-full ${item.color} mt-2 flex-shrink-0`} />
                        <div>
                          <div className="font-semibold mb-1">{item.title}</div>
                          <div className="text-sm text-muted-foreground">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  className="flex justify-center">
                  <ExtensionPopup />
                </motion.div>
              </div>
            </TabsContent>

            {/* Auto-Verification Tab */}
            <TabsContent value="auto">
              <div className="grid lg:grid-cols-2 gap-16 items-start">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                  <h2 className="text-3xl font-bold mb-4">Auto-Verification</h2>
                  <p className="text-muted-foreground mb-8">
                    TRACE automatically scans all media as you browse. No clicks needed —
                    trust badges appear instantly on every image and video.
                  </p>
                  <div className="space-y-4">
                    {(["verified", "modified", "unverified", "ai-generated"] as const).map((status) => (
                      <div key={status} className="flex items-center gap-4 p-3 rounded-xl bg-card/50 border border-border/50">
                        <div className="relative w-12 h-12">
                          <ExtensionBadge status={status} position="top-right" size="sm" showLabel={false} />
                        </div>
                        <div>
                          <div className="font-semibold capitalize">{status.replace("-", " ")}</div>
                          <div className="text-xs text-muted-foreground">Automatic badge applied</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <ContextMenuDemo />
                </motion.div>
              </div>
            </TabsContent>

            {/* Full Verification Tab */}
            <TabsContent value="full">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-3">Full Verification</h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Right-click any image or video for complete provenance data, edit history,
                  and blockchain proof.
                </p>
              </div>
              <ContextMenuDemo />
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-3">Smart Notifications</h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Get real-time alerts when you encounter deepfakes, manipulated media, or
                  unverified content. Customize notification settings to match your needs.
                </p>
              </div>
              <ExtensionNotifications />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Right-Click to Verify */}
      <section className="py-16 px-4 sm:px-6 border-t border-border/50">
        <div className="max-w-5xl mx-auto">
          <motion.div className="text-center mb-12"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-bold mb-3">Right-Click to Verify</h2>
          </motion.div>
          <ContextMenuDemo />
          <p className="text-center text-sm text-muted-foreground mt-4">
            Right-click any image or video on the web to verify with TRACE
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 sm:px-6 border-t border-border/50">
        <div className="max-w-5xl mx-auto">
          <ExtensionWorkflow />
        </div>
      </section>

      {/* Smart Notifications */}
      <section className="py-16 px-4 sm:px-6 border-t border-border/50">
        <div className="max-w-5xl mx-auto">
          <motion.div className="text-center mb-12"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-bold mb-3">Smart Notifications</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Get real-time alerts when you encounter deepfakes, manipulated media, or unverified
              content. Customize notification settings to match your needs.
            </p>
          </motion.div>
          <ExtensionNotifications />
        </div>
      </section>

      {/* Powerful Features */}
      <section className="px-4 sm:px-6 border-t border-border/50">
        <div className="max-w-6xl mx-auto">
          <ExtensionFeatures />
        </div>
      </section>

      {/* Download CTA */}
      <section className="border-t border-border/50">
        <ExtensionDownload />
      </section>

      {/* Footer nav */}
      <section className="border-t border-border/50 py-8 px-4 sm:px-6">
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