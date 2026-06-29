import { motion } from "motion/react";
import { Shield, Copy, Download, Share2, ExternalLink } from "lucide-react";

export function ContextMenuDemo() {
  return (
    <div className="relative">
      {/* Mock webpage with image */}
      <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden">
        <div className="bg-muted/20 border-b border-border/50 p-3 flex items-center gap-2">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-unverified/50" />
            <div className="w-3 h-3 rounded-full bg-modified/50" />
            <div className="w-3 h-3 rounded-full bg-verified/50" />
          </div>
          <div className="flex-1 mx-4 px-4 py-1.5 bg-background/50 rounded-lg text-xs font-mono text-muted-foreground">
            https://example.com/news/breaking
          </div>
        </div>

        <div className="p-8">
          <h3 className="text-xl font-bold mb-4">Breaking News Article</h3>
          <div className="relative inline-block">
            <div className="w-96 h-64 rounded-lg bg-gradient-to-br from-muted/50 to-muted/20 flex items-center justify-center border-2 border-dashed border-protocol/30">
              <div className="text-muted-foreground text-sm">Right-click this image</div>
            </div>

            {/* Context Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute top-12 left-12 w-64 bg-background/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-2xl overflow-hidden"
            >
              {/* TRACE Option - Highlighted */}
              <motion.div
                initial={{ backgroundColor: 'transparent' }}
                animate={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="p-3 hover:bg-protocol/10 cursor-pointer border-b border-border/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-protocol/20 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-protocol" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">Verify with TRACE</div>
                    <div className="text-xs text-muted-foreground">Check authenticity & provenance</div>
                  </div>
                </div>
              </motion.div>

              {/* Standard browser options */}
              <div className="p-1">
                <div className="p-2 hover:bg-muted/50 cursor-pointer rounded flex items-center gap-2 text-sm text-muted-foreground">
                  <Copy className="w-3 h-3" />
                  <span>Copy image</span>
                </div>
                <div className="p-2 hover:bg-muted/50 cursor-pointer rounded flex items-center gap-2 text-sm text-muted-foreground">
                  <Download className="w-3 h-3" />
                  <span>Save image as...</span>
                </div>
                <div className="p-2 hover:bg-muted/50 cursor-pointer rounded flex items-center gap-2 text-sm text-muted-foreground">
                  <ExternalLink className="w-3 h-3" />
                  <span>Open image in new tab</span>
                </div>
                <div className="p-2 hover:bg-muted/50 cursor-pointer rounded flex items-center gap-2 text-sm text-muted-foreground">
                  <Share2 className="w-3 h-3" />
                  <span>Share image</span>
                </div>
              </div>
            </motion.div>

            {/* Pointer indicating right-click */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="absolute top-8 left-8 w-12 h-12 rounded-full bg-protocol/20 flex items-center justify-center border-2 border-protocol"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-lg"
              >
                👆
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-4 text-center text-sm text-muted-foreground"
      >
        Right-click any media on the web to verify with TRACE
      </motion.div>
    </div>
  );
}
