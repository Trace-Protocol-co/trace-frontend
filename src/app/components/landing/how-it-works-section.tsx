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
    description: "Original encrypted media stored permanently on Walrus with blob certificates.",
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
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="relative overflow-hidden bg-gradient-to-b from-black to-zinc-950 py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="mb-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="mb-4 text-5xl font-bold tracking-tight text-white">
            How It Works
          </h2>
          <p className="text-xl text-white/60">
            Three steps to permanent media authenticity
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection line */}
          <div className="absolute left-0 right-0 top-1/2 hidden h-0.5 bg-gradient-to-r from-emerald-500 via-cyan-500 to-violet-500 opacity-20 lg:block" />

          <div className="grid gap-8 lg:grid-cols-3">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                className="relative"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 40 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
              >
                <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-8 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10">
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 transition-opacity group-hover:opacity-10`} />
                  
                  <div className="relative">
                    {/* Icon */}
                    <motion.div
                      className={`mb-6 inline-flex size-16 items-center justify-center rounded-xl bg-gradient-to-br ${step.color}`}
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <step.icon className="size-8 text-white" />
                    </motion.div>

                    {/* Step number */}
                    <div className="mb-4 text-sm font-semibold text-white/40">
                      STEP {index + 1}
                    </div>

                    {/* Title */}
                    <h3 className="mb-4 text-2xl font-bold text-white">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="leading-relaxed text-white/70">
                      {step.description}
                    </p>
                  </div>

                  {/* Animated border glow */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl opacity-0 transition-opacity group-hover:opacity-100"
                    style={{
                      background: `linear-gradient(var(--angle), transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)`,
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <p className="text-sm uppercase tracking-wider text-white/40">
            Powered by cryptographic proofs and decentralized infrastructure
          </p>
        </motion.div>
      </div>
    </section>
  );
}
