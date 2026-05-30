import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { Database, Lock, Zap, Shield, HardDrive, Network } from "lucide-react";

const walrusFeatures = [
  {
    icon: Database,
    title: "Decentralized Blob Storage",
    description: "Store media permanently without relying on centralized servers",
  },
  {
    icon: Shield,
    title: "Erasure Coding",
    description: "Data redundancy ensures media can't be lost or censored",
  },
  {
    icon: HardDrive,
    title: "Blob Certification",
    description: "Cryptographic proofs verify data integrity and availability",
  },
  {
    icon: Zap,
    title: "Low-Cost Video Storage",
    description: "Economical permanent archival for high-resolution media",
  },
];

const suiFeatures = [
  {
    icon: Network,
    title: "Object-Based Provenance",
    description: "Native on-chain representation of media edit history",
  },
  {
    icon: Lock,
    title: "Move Resource Security",
    description: "Ownership and authenticity enforced at the protocol level",
  },
  {
    icon: Shield,
    title: "zkLogin Onboarding",
    description: "Seamless user experience without managing private keys",
  },
  {
    icon: Zap,
    title: "Sponsored Transactions",
    description: "Users can verify media without paying gas fees",
  },
];

export function WhySuiWalrus() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="relative overflow-hidden bg-black py-32">
      {/* Background gradient */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(6,182,212,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(139,92,246,0.1),transparent_50%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="mb-4 text-5xl font-bold tracking-tight text-white">
            Why Sui + Walrus
          </h2>
          <p className="text-xl text-white/60">
            Enterprise-grade infrastructure for media authenticity
          </p>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Walrus Card */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -40 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div className="h-full overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950/30 to-transparent p-8 backdrop-blur-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500">
                  <Database className="size-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Walrus</h3>
              </div>

              <p className="mb-8 text-white/70">
                Decentralized storage network designed for permanent media archival with
                cryptographic integrity guarantees.
              </p>

              <div className="space-y-4">
                {walrusFeatures.map((feature, i) => (
                  <motion.div
                    key={feature.title}
                    className="group flex gap-4 rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:border-cyan-500/30 hover:bg-cyan-500/10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 transition-all group-hover:bg-cyan-500/30">
                      <feature.icon className="size-5" />
                    </div>
                    <div>
                      <div className="mb-1 font-semibold text-white">{feature.title}</div>
                      <div className="text-sm text-white/60">{feature.description}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Sui Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : 40 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div className="h-full overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-950/30 to-transparent p-8 backdrop-blur-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-500">
                  <Lock className="size-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Sui</h3>
              </div>

              <p className="mb-8 text-white/70">
                High-performance blockchain with native support for complex provenance graphs and
                instant finality.
              </p>

              <div className="space-y-4">
                {suiFeatures.map((feature, i) => (
                  <motion.div
                    key={feature.title}
                    className="group flex gap-4 rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:border-violet-500/30 hover:bg-violet-500/10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/20 text-violet-400 transition-all group-hover:bg-violet-500/30">
                      <feature.icon className="size-5" />
                    </div>
                    <div>
                      <div className="mb-1 font-semibold text-white">{feature.title}</div>
                      <div className="text-sm text-white/60">{feature.description}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Architecture Diagram */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 40 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-8 backdrop-blur-sm">
            <div className="mb-6 text-center">
              <h4 className="text-xl font-bold text-white">Architecture Flow</h4>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              {[
                { label: "Device", color: "from-emerald-500 to-cyan-500" },
                { label: "→", isArrow: true },
                { label: "Walrus Storage", color: "from-cyan-500 to-blue-500" },
                { label: "→", isArrow: true },
                { label: "Sui Blockchain", color: "from-violet-500 to-purple-500" },
                { label: "→", isArrow: true },
                { label: "Verification Layer", color: "from-blue-500 to-emerald-500" },
              ].map((item, i) =>
                item.isArrow ? (
                  <motion.div
                    key={i}
                    className="text-2xl text-white/40"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -10 }}
                    transition={{ delay: 0.8 + i * 0.1, duration: 0.4 }}
                  >
                    {item.label}
                  </motion.div>
                ) : (
                  <motion.div
                    key={i}
                    className={`rounded-xl bg-gradient-to-br ${item.color} px-6 py-3 font-semibold text-white shadow-lg`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: isInView ? 1 : 0, scale: isInView ? 1 : 0.8 }}
                    transition={{ delay: 0.8 + i * 0.1, duration: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {item.label}
                  </motion.div>
                )
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
