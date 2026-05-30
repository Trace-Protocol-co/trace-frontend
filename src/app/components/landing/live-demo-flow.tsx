import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { Camera, Upload, GitBranch, Edit, AlertTriangle, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: Camera,
    title: "Capture Footage",
    description: "Record original media with device signature",
    status: "complete",
  },
  {
    icon: Upload,
    title: "Upload to TRACE",
    description: "Media stored on Walrus, registered on Sui",
    status: "complete",
  },
  {
    icon: GitBranch,
    title: "Generate Provenance",
    description: "Cryptographic proof created and timestamped",
    status: "complete",
  },
  {
    icon: Edit,
    title: "Create Edited Fake",
    description: "Someone makes an unauthorized modification",
    status: "warning",
  },
  {
    icon: AlertTriangle,
    title: "Detect Manipulation",
    description: "TRACE identifies the altered version",
    status: "alert",
  },
  {
    icon: CheckCircle2,
    title: "Verify Authenticity",
    description: "Public can confirm original is legitimate",
    status: "verified",
  },
];

export function LiveDemoFlow() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="relative overflow-hidden bg-gradient-to-b from-zinc-950 to-black py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="mb-4 text-5xl font-bold tracking-tight text-white">
            See It In Action
          </h2>
          <p className="text-xl text-white/60">
            From capture to verification in six steps
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Connection line - desktop */}
          <div className="absolute left-0 right-0 top-16 hidden h-0.5 bg-gradient-to-r from-emerald-500 via-amber-500 to-emerald-500 lg:block" />
          
          {/* Connection line - mobile */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-amber-500 to-emerald-500 lg:hidden" />

          <div className="grid gap-8 lg:grid-cols-3">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                className="relative"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 40 }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
              >
                <div className="group relative flex gap-4 lg:flex-col lg:gap-0">
                  {/* Mobile timeline dot */}
                  <div className="absolute -left-2 top-2 size-4 rounded-full border-4 border-black bg-white lg:hidden" />

                  {/* Icon */}
                  <motion.div
                    className={`relative z-10 mx-auto flex size-16 shrink-0 items-center justify-center rounded-2xl shadow-lg lg:mb-6 ${
                      step.status === "verified" || step.status === "complete"
                        ? "bg-gradient-to-br from-emerald-500 to-cyan-500"
                        : step.status === "warning"
                        ? "bg-gradient-to-br from-amber-500 to-orange-500"
                        : "bg-gradient-to-br from-red-500 to-rose-500"
                    }`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <step.icon className="size-8 text-white" />
                    
                    {/* Pulse ring */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl border-2 border-white/50"
                      animate={{
                        scale: [1, 1.2, 1.2, 1],
                        opacity: [0.5, 0.2, 0, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: index * 0.3,
                      }}
                    />
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 lg:text-center">
                    {/* Step number */}
                    <div className="mb-2 text-sm font-semibold text-white/40">
                      STEP {index + 1}
                    </div>

                    {/* Title */}
                    <h3 className="mb-2 text-xl font-bold text-white">{step.title}</h3>

                    {/* Description */}
                    <p className="text-sm leading-relaxed text-white/70">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Status indicator */}
                <motion.div
                  className={`mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                    step.status === "verified" || step.status === "complete"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : step.status === "warning"
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: isInView ? 1 : 0, scale: isInView ? 1 : 0.8 }}
                  transition={{ delay: index * 0.15 + 0.3, duration: 0.4 }}
                >
                  <div
                    className={`size-1.5 rounded-full ${
                      step.status === "verified" || step.status === "complete"
                        ? "bg-emerald-400"
                        : step.status === "warning"
                        ? "bg-amber-400"
                        : "bg-red-400"
                    }`}
                  />
                  {step.status === "verified" || step.status === "complete"
                    ? "Verified"
                    : step.status === "warning"
                    ? "Modified"
                    : "Detected"}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom callout */}
        <motion.div
          className="mt-20 rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-950/30 to-transparent p-8 text-center backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className="mx-auto max-w-2xl">
            <h3 className="mb-4 text-2xl font-bold text-white">
              Trust at Every Step
            </h3>
            <p className="mb-6 text-white/70">
              TRACE provides end-to-end verification, from the moment media is created to every
              edit and redistribution. Cryptographic proofs make manipulation detectable and
              authenticity verifiable by anyone.
            </p>
            <div className="text-sm uppercase tracking-wider text-emerald-400">
              Powered by decentralized infrastructure
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
