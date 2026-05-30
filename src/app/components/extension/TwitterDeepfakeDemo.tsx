import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { Heart, MessageCircle, Repeat2, Share, Bookmark, MoreHorizontal, Sparkles, AlertTriangle, CheckCircle2, TrendingUp, Eye, Shield, X } from "lucide-react";
import { ExtensionBadge } from "./ExtensionBadge";
import { Button } from "../ui/button";

export function TwitterDeepfakeDemo() {
  const [showModal, setShowModal] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  const [badgeVisible, setBadgeVisible] = useState(false);

  useEffect(() => {
    // Animation sequence
    const timer1 = setTimeout(() => {
      setScanProgress(10);
    }, 1000);

    const timer2 = setTimeout(() => {
      setScanProgress(40);
    }, 1500);

    const timer3 = setTimeout(() => {
      setScanProgress(70);
    }, 2000);

    const timer4 = setTimeout(() => {
      setScanProgress(100);
      setScanComplete(true);
    }, 2500);

    const timer5 = setTimeout(() => {
      setBadgeVisible(true);
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, []);

  const aiMetrics = [
    { label: "Face Manipulation", confidence: 94 },
    { label: "Synthetic Features", confidence: 89 },
    { label: "Lighting Inconsistencies", confidence: 91 },
    { label: "Temporal Artifacts", confidence: 87 },
  ];

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Browser Chrome */}
      <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-t-2xl p-3 flex items-center gap-2">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-unverified/50" />
          <div className="w-3 h-3 rounded-full bg-modified/50" />
          <div className="w-3 h-3 rounded-full bg-verified/50" />
        </div>
        <div className="flex-1 mx-4 px-4 py-1.5 bg-background/50 rounded-lg flex items-center gap-2">
          <div className="w-3 h-3 text-muted-foreground">🔒</div>
          <div className="text-xs font-mono text-muted-foreground">twitter.com/home</div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-verified/10 border border-verified/20">
          <Shield className="w-3 h-3 text-verified" />
          <span className="text-xs font-semibold">TRACE Active</span>
        </div>
      </div>

      {/* Twitter Interface */}
      <div className="bg-background border-x border-b border-border/50 rounded-b-2xl overflow-hidden">
        {/* Twitter Header */}
        <div className="border-b border-border/50 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Home</h2>
          <Sparkles className="w-5 h-5 text-muted-foreground" />
        </div>

        {/* Tweet */}
        <div className="border-b border-border/50 hover:bg-card/30 transition-colors">
          <div className="p-4">
            {/* Tweet Header */}
            <div className="flex gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-ai-generated to-protocol flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold">Tech News Daily</span>
                  <span className="text-muted-foreground text-sm">@technewsdaily</span>
                  <span className="text-muted-foreground text-sm">· 2h</span>
                  <MoreHorizontal className="w-4 h-4 text-muted-foreground ml-auto" />
                </div>
                <p className="text-sm mb-3">
                  BREAKING: Exclusive interview with tech CEO reveals groundbreaking AI developments.
                  This is going to change everything! 🚀 #TechNews #AI
                </p>
              </div>
            </div>

            {/* Tweet Media - The Deepfake Image */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-muted/50 to-muted/20 aspect-video mb-3">
              {/* Mock video/image content */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="text-6xl">👤</div>
                    <div className="text-muted-foreground/50 text-sm font-mono">
                      "CEO Interview Footage"
                    </div>
                  </div>
                </div>

                {/* Scanning Effect */}
                {scanProgress > 0 && !scanComplete && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-b from-transparent via-protocol/20 to-transparent"
                    initial={{ top: '-100%' }}
                    animate={{ top: '100%' }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                )}

                {/* Scan Progress Overlay */}
                {scanProgress > 0 && !badgeVisible && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center"
                  >
                    <div className="text-center space-y-4 max-w-xs">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="w-12 h-12 mx-auto text-ai-generated" />
                      </motion.div>
                      <div>
                        <div className="text-sm font-semibold mb-2">Analyzing Media...</div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-protocol to-ai-generated"
                            initial={{ width: 0 }}
                            animate={{ width: `${scanProgress}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                          {scanProgress < 30 && "Computing perceptual hash..."}
                          {scanProgress >= 30 && scanProgress < 70 && "Querying blockchain..."}
                          {scanProgress >= 70 && scanProgress < 100 && "Running AI detection..."}
                          {scanProgress === 100 && "Analysis complete"}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* TRACE Badge - Appears after scan */}
              {badgeVisible && (
                <div className="absolute top-4 right-4">
                  <ExtensionBadge
                    status="ai-generated"
                    position="top-right"
                    size="lg"
                    showLabel={true}
                    onClick={() => setShowModal(true)}
                  />
                </div>
              )}

              {/* Deepfake Warning Banner */}
              <AnimatePresence>
                {badgeVisible && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ai-generated/90 to-transparent backdrop-blur-xl p-6"
                  >
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-white flex-shrink-0 mt-1" />
                      <div className="flex-1 text-white">
                        <div className="font-bold mb-1">AI-Generated Content Detected</div>
                        <div className="text-xs opacity-90">
                          This media appears to be synthetically generated with 92% confidence.
                          Click badge for details.
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Tweet Actions */}
            <div className="flex items-center justify-between text-muted-foreground max-w-md">
              <button className="flex items-center gap-2 hover:text-protocol transition-colors group">
                <MessageCircle className="w-5 h-5 group-hover:bg-protocol/10 rounded-full p-1 w-8 h-8" />
                <span className="text-sm">432</span>
              </button>
              <button className="flex items-center gap-2 hover:text-verified transition-colors group">
                <Repeat2 className="w-5 h-5 group-hover:bg-verified/10 rounded-full p-1 w-8 h-8" />
                <span className="text-sm">1.2K</span>
              </button>
              <button className="flex items-center gap-2 hover:text-unverified transition-colors group">
                <Heart className="w-5 h-5 group-hover:bg-unverified/10 rounded-full p-1 w-8 h-8" />
                <span className="text-sm">3.4K</span>
              </button>
              <button className="flex items-center gap-2 hover:text-foreground transition-colors group">
                <TrendingUp className="w-5 h-5 group-hover:bg-muted/10 rounded-full p-1 w-8 h-8" />
                <span className="text-sm">12K</span>
              </button>
              <button className="flex items-center gap-2 hover:text-foreground transition-colors group">
                <Share className="w-5 h-5 group-hover:bg-muted/10 rounded-full p-1 w-8 h-8" />
              </button>
              <button className="flex items-center gap-2 hover:text-foreground transition-colors group">
                <Bookmark className="w-5 h-5 group-hover:bg-muted/10 rounded-full p-1 w-8 h-8" />
              </button>
            </div>
          </div>
        </div>

        {/* Other tweets placeholder */}
        <div className="p-4 border-b border-border/50 opacity-30">
          <div className="flex gap-3">
            <div className="w-12 h-12 rounded-full bg-muted flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </div>
          </div>
        </div>
      </div>

      {/* Detailed AI Detection Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background border border-border/50 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-border/50 bg-gradient-to-r from-ai-generated/20 to-ai-generated/5">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-ai-generated/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-7 h-7 text-ai-generated" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">AI-Generated Content Detected</h3>
                    <p className="text-sm text-muted-foreground">
                      Deep learning analysis indicates this media is synthetically generated
                    </p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
                {/* Overall Confidence */}
                <div className="p-4 rounded-xl bg-ai-generated/10 border border-ai-generated/20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold">AI Generation Confidence</span>
                    <span className="text-2xl font-bold text-ai-generated">92%</span>
                  </div>
                  <div className="h-3 bg-background/50 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-ai-generated to-protocol"
                      initial={{ width: 0 }}
                      animate={{ width: '92%' }}
                      transition={{ duration: 1, delay: 0.3 }}
                    />
                  </div>
                </div>

                {/* Detection Metrics */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-ai-generated" />
                    Detection Analysis
                  </h4>
                  <div className="space-y-3">
                    {aiMetrics.map((metric, index) => (
                      <motion.div
                        key={metric.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border/50"
                      >
                        <span className="text-sm">{metric.label}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-ai-generated"
                              initial={{ width: 0 }}
                              animate={{ width: `${metric.confidence}%` }}
                              transition={{ duration: 0.8, delay: index * 0.1 }}
                            />
                          </div>
                          <span className="text-sm font-mono w-12 text-right">{metric.confidence}%</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Technical Details */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-protocol" />
                    Technical Details
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-card/50 border border-border/50">
                      <div className="text-xs text-muted-foreground mb-1">Detection Model</div>
                      <div className="text-sm font-mono">DeepFake-v4.2</div>
                    </div>
                    <div className="p-3 rounded-lg bg-card/50 border border-border/50">
                      <div className="text-xs text-muted-foreground mb-1">Analysis Time</div>
                      <div className="text-sm font-mono">127ms</div>
                    </div>
                    <div className="p-3 rounded-lg bg-card/50 border border-border/50">
                      <div className="text-xs text-muted-foreground mb-1">Media Hash</div>
                      <div className="text-sm font-mono truncate">0x9f2a...</div>
                    </div>
                    <div className="p-3 rounded-lg bg-card/50 border border-border/50">
                      <div className="text-xs text-muted-foreground mb-1">Blockchain Query</div>
                      <div className="text-sm font-mono">Sui Testnet</div>
                    </div>
                  </div>
                </div>

                {/* Warning & Recommendations */}
                <div className="p-4 rounded-xl bg-modified/10 border border-modified/20">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-modified flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold mb-2">Recommended Actions</div>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Exercise caution when sharing this content</li>
                        <li>• Verify claims through other trusted sources</li>
                        <li>• Consider reporting to platform if misleading</li>
                        <li>• Check creator's verification history</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-border/50 bg-card/30 flex gap-3">
                <Button variant="outline" size="sm" className="flex-1">
                  Report as Misleading
                </Button>
                <Button size="sm" className="flex-1 bg-protocol hover:bg-protocol/90 text-white">
                  Share Verification
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
