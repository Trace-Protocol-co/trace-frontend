import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { Camera, Database, ShieldCheck } from "lucide-react";

const steps = [
  {
    icon: Camera,
    title: "CAPTURE",
    description: "Media signed at creation. Timestamped using Sui consensus clock.",
    color: "from-emerald-500 to-cyan-500",
  },
  {
    icon: Database,
    title: "STORE",
    description: "Original media stored permanently on Walrus decentralized storage.",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: ShieldCheck,
    title: "VERIFY",
    description: "Anyone can inspect provenance history, detect modifications, and verify authenticity.",
    color: "from-blue-500 to-violet-500",
  },
];

export function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="relative overflow-hidden bg-gradient-to-b from-black to-zinc-950 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div className="mb-12 sm:mb-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}>
          <h2 className="mb-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            How It Works
          </h2>
          <p className="text-base sm:text-xl text-white/60">
            Three steps to permanent media authenticity
          </p>
        </motion.div>

        <div className="grid gap-6 sm:gap-8 sm:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div key={step.title}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 40 }}
              transition={{ delay: index * 0.2, duration: 0.8 }}>
              <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-6 sm:p-8 backdrop-blur-sm hover:border-white/20 hover:bg-white/10 transition-all h-full">
                <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 transition-opacity group-hover:opacity-10`} />
                <div className="relative">
                  <div className={`mb-4 sm:mb-6 inline-flex size-12 sm:size-16 items-center justify-center rounded-xl bg-gradient-to-br ${step.color}`}>
                    <step.icon className="size-6 sm:size-8 text-white" />
                  </div>
                  <div className="mb-2 sm:mb-4 text-xs sm:text-sm font-semibold text-white/40">STEP {index + 1}</div>
                  <h3 className="mb-2 sm:mb-4 text-xl sm:text-2xl font-bold text-white">{step.title}</h3>
                  <p className="text-sm sm:text-base leading-relaxed text-white/70">{step.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div className="mt-12 sm:mt-20 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{ delay: 0.8 }}>
          <p className="text-xs sm:text-sm uppercase tracking-wider text-white/40">
            Powered by cryptographic proofs and decentralized infrastructure
          </p>
        </motion.div>
      </div>
    </section>
  );
}