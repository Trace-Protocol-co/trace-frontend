import { motion } from "motion/react";
import { Globe, Scan, Database, Shield, CheckCircle2, Zap } from "lucide-react";

export function ExtensionArchitecture() {
  return (
    <div className="py-20 bg-gradient-to-b from-background to-card/20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Extension Architecture</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Understanding how TRACE verifies media authenticity in your browser
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          {/* Architecture Flow */}
          <div className="grid lg:grid-cols-5 gap-8 items-center mb-16">
            {/* Step 1: Browser */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
              className="relative"
            >
              <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-xl p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-protocol/20 flex items-center justify-center">
                  <Globe className="w-8 h-8 text-protocol" />
                </div>
                <h3 className="font-bold mb-2">Browser</h3>
                <p className="text-xs text-muted-foreground">Extension detects media on webpage</p>
              </div>
            </motion.div>

            {/* Arrow */}
            <div className="hidden lg:block text-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-2xl text-protocol"
              >
                →
              </motion.div>
            </div>

            {/* Step 2: Hash */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-xl p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-ai-generated/20 flex items-center justify-center">
                  <Scan className="w-8 h-8 text-ai-generated" />
                </div>
                <h3 className="font-bold mb-2">Hash</h3>
                <p className="text-xs text-muted-foreground">Compute perceptual hash locally</p>
              </div>
            </motion.div>

            {/* Arrow */}
            <div className="hidden lg:block text-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-2xl text-ai-generated"
              >
                →
              </motion.div>
            </div>

            {/* Step 3: Query Blockchain */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-xl p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-verified/20 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-verified" />
                </div>
                <h3 className="font-bold mb-2">Sui Query</h3>
                <p className="text-xs text-muted-foreground">Search blockchain for matching hash</p>
              </div>
            </motion.div>
          </div>

          {/* Second Row */}
          <div className="grid lg:grid-cols-5 gap-8 items-center mb-16">
            {/* Step 5: Display */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="relative lg:col-start-1"
            >
              <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-xl p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-verified/20 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-verified" />
                </div>
                <h3 className="font-bold mb-2">Display Badge</h3>
                <p className="text-xs text-muted-foreground">Show trust indicator on media</p>
              </div>
            </motion.div>

            {/* Arrow */}
            <div className="hidden lg:block text-center">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
                className="text-2xl text-modified"
              >
                ←
              </motion.div>
            </div>

            {/* Step 4: Retrieve Data */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="relative"
            >
              <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-xl p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-modified/20 flex items-center justify-center">
                  <Database className="w-8 h-8 text-modified" />
                </div>
                <h3 className="font-bold mb-2">Fetch Data</h3>
                <p className="text-xs text-muted-foreground">Get provenance from Walrus</p>
              </div>
            </motion.div>

            {/* Arrow */}
            <div className="hidden lg:block text-center">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="text-2xl text-verified"
              >
                ←
              </motion.div>
            </div>

            {/* Continuation from Step 3 */}
            <div className="hidden lg:block"></div>
          </div>

          {/* Performance Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.9 }}
            className="grid md:grid-cols-4 gap-4 mb-12"
          >
            <div className="bg-gradient-to-br from-verified/20 to-verified/5 border border-verified/20 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-verified mb-1">&lt;100ms</div>
              <div className="text-xs text-muted-foreground">Verification Time</div>
            </div>
            <div className="bg-gradient-to-br from-protocol/20 to-protocol/5 border border-protocol/20 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-protocol mb-1">0</div>
              <div className="text-xs text-muted-foreground">Tracking & Analytics</div>
            </div>
            <div className="bg-gradient-to-br from-ai-generated/20 to-ai-generated/5 border border-ai-generated/20 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-ai-generated mb-1">100%</div>
              <div className="text-xs text-muted-foreground">On-Chain Proofs</div>
            </div>
            <div className="bg-gradient-to-br from-modified/20 to-modified/5 border border-modified/20 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-modified mb-1">∞</div>
              <div className="text-xs text-muted-foreground">Media Coverage</div>
            </div>
          </motion.div>

          {/* Technical Details */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-8"
          >
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-protocol" />
              Technical Implementation
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-sm text-verified">Client-Side Processing</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-verified">•</span>
                    <span>Perceptual hashing using pHash algorithm</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-verified">•</span>
                    <span>Zero data sent to TRACE servers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-verified">•</span>
                    <span>Direct RPC calls to Sui nodes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-verified">•</span>
                    <span>Local caching for performance</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-sm text-protocol">Blockchain Integration</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-protocol">•</span>
                    <span>Sui blockchain for provenance graph</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-protocol">•</span>
                    <span>Walrus decentralized storage for media</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-protocol">•</span>
                    <span>Cryptographic proof verification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-protocol">•</span>
                    <span>Immutable edit history tracking</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
