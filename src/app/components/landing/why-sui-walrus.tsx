import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { Database, Lock, Zap, Shield, HardDrive, Network } from "lucide-react";

const walrusFeatures = [
  { icon: Database,  title: "Decentralized Blob Storage", description: "Store media permanently without relying on centralized servers" },
  { icon: Shield,    title: "Erasure Coding",             description: "Data redundancy ensures media can't be lost or censored" },
  { icon: HardDrive, title: "Blob Certification",         description: "Cryptographic proofs verify data integrity and availability" },
];

const suiFeatures = [
  { icon: Zap,     title: "400ms Finality",     description: "Media registration feels instant — no waiting for confirmations" },
  { icon: Lock,    title: "Object Model",        description: "MediaRecord is a first-class on-chain object with Display support" },
  { icon: Network, title: "zkLogin",             description: "Journalists sign in with Google — no wallet or seed phrase needed" },
];

export function WhySuiWalrus() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section ref={ref} className="relative bg-black py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div className="mb-12 sm:mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}>
          <h2 className="mb-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Why Sui + Walrus
          </h2>
          <p className="text-base sm:text-xl text-white/60 max-w-2xl mx-auto">
            The only infrastructure stack that meets every requirement for decentralized media provenance
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Walrus */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -20 }}
            transition={{ delay: 0.2 }}>
            <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-b from-blue-500/10 to-transparent p-6 sm:p-8 h-full">
              <div className="mb-6 sm:mb-8 flex items-center gap-3">
                <div className="flex size-10 sm:size-12 items-center justify-center rounded-xl bg-blue-500/20">
                  <Database className="size-5 sm:size-6 text-blue-400" />
                </div>
                <div>
                  <div className="font-bold text-lg sm:text-xl text-white">Walrus Storage</div>
                  <div className="text-xs sm:text-sm text-white/40">Decentralized blob storage</div>
                </div>
              </div>
              <div className="space-y-4 sm:space-y-6">
                {walrusFeatures.map((f, i) => (
                  <motion.div key={f.title} className="flex gap-3 sm:gap-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 10 }}
                    transition={{ delay: 0.3 + i * 0.1 }}>
                    <div className="flex size-8 sm:size-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/20">
                      <f.icon className="size-4 sm:size-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm sm:text-base text-white mb-0.5">{f.title}</div>
                      <div className="text-xs sm:text-sm text-white/60">{f.description}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Sui */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : 20 }}
            transition={{ delay: 0.3 }}>
            <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-b from-cyan-500/10 to-transparent p-6 sm:p-8 h-full">
              <div className="mb-6 sm:mb-8 flex items-center gap-3">
                <div className="flex size-10 sm:size-12 items-center justify-center rounded-xl bg-cyan-500/20">
                  <Zap className="size-5 sm:size-6 text-cyan-400" />
                </div>
                <div>
                  <div className="font-bold text-lg sm:text-xl text-white">Sui Blockchain</div>
                  <div className="text-xs sm:text-sm text-white/40">Layer 1 for provenance</div>
                </div>
              </div>
              <div className="space-y-4 sm:space-y-6">
                {suiFeatures.map((f, i) => (
                  <motion.div key={f.title} className="flex gap-3 sm:gap-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 10 }}
                    transition={{ delay: 0.4 + i * 0.1 }}>
                    <div className="flex size-8 sm:size-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20">
                      <f.icon className="size-4 sm:size-5 text-cyan-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm sm:text-base text-white mb-0.5">{f.title}</div>
                      <div className="text-xs sm:text-sm text-white/60">{f.description}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div className="mt-10 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ delay: 0.6 }}>
          {[
            { value: "~400ms", label: "Finality Time" },
            { value: "$0.001", label: "Per Registration" },
            { value: "29/29",  label: "Tests Passing" },
            { value: "4",      label: "Move Modules" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-6 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-xs sm:text-sm text-white/40">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}