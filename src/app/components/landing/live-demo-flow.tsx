import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { Camera, Upload, GitBranch, Edit, AlertTriangle, CheckCircle2 } from "lucide-react";

const steps = [
  { icon: Camera,       title: "Capture Footage",    description: "Record original media with device signature", status: "complete" },
  { icon: Upload,       title: "Upload to TRACE",    description: "Media stored on Walrus, registered on Sui",   status: "complete" },
  { icon: GitBranch,    title: "Build Provenance",   description: "Edit chain created — each version tracked",   status: "complete" },
  { icon: Edit,         title: "Detect Edit",        description: "Modified version flagged automatically",      status: "warning"  },
  { icon: AlertTriangle,title: "Alert Consumer",     description: "Viewer sees MODIFIED badge, not VERIFIED",    status: "warning"  },
  { icon: CheckCircle2, title: "Truth Preserved",    description: "Original record remains immutable on-chain",  status: "complete" },
];

export function LiveDemoFlow() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section ref={ref} className="relative bg-gradient-to-b from-zinc-950 to-black py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div className="mb-12 sm:mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}>
          <h2 className="mb-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            End-to-End Demo
          </h2>
          <p className="text-base sm:text-xl text-white/60">
            How TRACE catches media manipulation in real-time
          </p>
        </motion.div>

        {/* Mobile: vertical list, Desktop: grid */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div key={step.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
              transition={{ delay: i * 0.1 }}>
              <div className={`rounded-xl border p-4 sm:p-6 h-full ${
                step.status === "warning"
                  ? "border-amber-500/30 bg-amber-500/5"
                  : "border-white/10 bg-white/5"
              }`}>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className={`flex size-9 sm:size-11 shrink-0 items-center justify-center rounded-xl ${
                    step.status === "warning"
                      ? "bg-amber-500/20"
                      : "bg-emerald-500/20"
                  }`}>
                    <step.icon className={`size-4 sm:size-5 ${
                      step.status === "warning" ? "text-amber-400" : "text-emerald-400"
                    }`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-white/30 font-mono">0{i+1}</span>
                      <span className="font-semibold text-sm sm:text-base text-white">{step.title}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-white/60">{step.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}