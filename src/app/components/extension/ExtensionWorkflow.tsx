import { motion } from "motion/react";
import { MousePointer2, Scan, CheckCircle2, Eye } from "lucide-react";

const steps = [
  {
    icon: MousePointer2,
    title: "Browse Normally",
    description: "Visit any website with media",
    color: "protocol",
  },
  {
    icon: Scan,
    title: "Auto-Scan",
    description: "TRACE scans media in real-time using on-chain proofs",
    color: "verified",
  },
  {
    icon: CheckCircle2,
    title: "See Badges",
    description: "Trust indicators appear directly on media",
    color: "ai-generated",
  },
  {
    icon: Eye,
    title: "Explore Details",
    description: "Click badges to see full provenance and edit history",
    color: "modified",
  },
];

export function ExtensionWorkflow() {
  return (
    <div className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold mb-4">How It Works</h2>
        <p className="text-muted-foreground">
          Four simple steps to verify media across the entire web
        </p>
      </motion.div>

      <div className="relative max-w-5xl mx-auto">
        {/* Connection line */}
        <div className="hidden lg:block absolute top-20 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const colorMap = {
              verified: '#10b981',
              modified: '#f59e0b',
              protocol: '#3b82f6',
              'ai-generated': '#8b5cf6',
            };
            const color = colorMap[step.color as keyof typeof colorMap];

            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative text-center"
              >
                {/* Step number */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-background border-2 border-border flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>

                {/* Icon */}
                <motion.div
                  className="relative inline-flex items-center justify-center w-32 h-32 mb-6 rounded-2xl overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div
                    className="absolute inset-0 opacity-20 blur-2xl"
                    style={{ backgroundColor: color }}
                  />
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      background: `radial-gradient(circle at center, ${color} 0%, transparent 70%)`
                    }}
                  />
                  <Icon className="w-12 h-12 relative z-10" style={{ color }} />

                  {/* Pulse ring */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2"
                    style={{ borderColor: color }}
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.3,
                    }}
                  />
                </motion.div>

                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
