import { motion } from "motion/react";
import { Code2 } from "lucide-react";

export function ApiPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="inline-flex items-center justify-center size-16 rounded-2xl border border-white/10 bg-white/5 mb-6">
          <Code2 className="size-7 text-blue-400" />
        </div>
        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-xs text-blue-400">
          <div className="size-1.5 rounded-full bg-blue-400 animate-pulse" />
          Coming Soon
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Public API</h1>
        <p className="text-white/50 leading-relaxed">
          Full API documentation, endpoint reference, and SDK examples are on the way.
          Drop your email on the home page to be the first to know when it launches.
        </p>
      </motion.div>
    </div>
  );
}