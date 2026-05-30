import { motion } from "motion/react";
import { Button } from "../ui/button";
import { Link } from "react-router";
import { useEffect, useState } from "react";

export function HeroSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-black">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <motion.div
          className="absolute left-1/4 top-1/4 size-48 sm:size-96 rounded-full bg-emerald-500/20 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-1/4 bottom-1/4 size-48 sm:size-96 rounded-full bg-cyan-500/20 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-24 sm:pt-32 pb-16 sm:pb-24">
        <motion.div
          className="mx-auto max-w-4xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            className="mb-6 sm:mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 sm:px-4 py-1.5 sm:py-2 backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: mounted ? 1 : 0, scale: mounted ? 1 : 0.9 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <motion.div
              className="size-2 rounded-full bg-emerald-500"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-xs sm:text-sm text-white/70">HTTPS for Media</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="mb-4 sm:mb-6 bg-gradient-to-b from-white to-white/70 bg-clip-text text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Trust, Embedded Into{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Every Frame
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="mb-8 sm:mb-12 text-base sm:text-xl leading-relaxed text-white/60 px-2 sm:px-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            TRACE makes media authenticity verifiable by default using cryptographic provenance,
            decentralized storage, and immutable edit histories powered by Sui and Walrus.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <Button asChild size="lg" className="w-full sm:w-auto bg-white text-black hover:bg-white/90 font-semibold">
              <Link to="/verify">Verify Media</Link>
            </Button>
            <Button asChild size="lg" variant="outline"
              className="w-full sm:w-auto border-white/20 bg-white/5 text-white hover:bg-white/10">
              <Link to="/upload">Upload Original</Link>
            </Button>
            <Button asChild size="lg" variant="ghost"
              className="w-full sm:w-auto text-white/70 hover:bg-white/5 hover:text-white">
              <Link to="/graph/demo">View Demo Graph</Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Graph preview */}
        <motion.div
          className="mx-auto mt-16 sm:mt-24 max-w-5xl px-2 sm:px-0"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: mounted ? 1 : 0, scale: mounted ? 1 : 0.95 }}
          transition={{ delay: 0.7, duration: 1 }}
        >
          <div className="relative rounded-xl sm:rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-4 sm:p-8 backdrop-blur-sm overflow-hidden">
            <ProvenanceGraphPreview />
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator — hidden on small screens */}
      <motion.div
        className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 hidden sm:flex"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex flex-col items-center gap-2 text-white/40">
          <span className="text-xs uppercase tracking-wider">Scroll</span>
          <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </motion.div>
    </section>
  );
}

function ProvenanceGraphPreview() {
  const nodes = [
    { id: "original",  label: "Original",         status: "verified",   x: 50, y: 40 },
    { id: "trimmed",   label: "Trimmed",           status: "modified",   x: 20, y: 75 },
    { id: "graded",    label: "Color Graded",      status: "modified",   x: 40, y: 75 },
    { id: "reupload",  label: "Reuploaded",        status: "verified",   x: 60, y: 75 },
    { id: "faceswap",  label: "AI Face Swap",      status: "synthetic",  x: 80, y: 75 },
  ];

  const statusColors = {
    verified:   "bg-emerald-500",
    modified:   "bg-amber-500",
    unverified: "bg-red-500",
    synthetic:  "bg-violet-500",
  };

  return (
    <div className="relative h-48 sm:h-80">
      <svg className="absolute inset-0 size-full">
        {nodes.slice(1).map((node) => (
          <motion.line
            key={node.id}
            x1={`${nodes[0].x}%`} y1={`${nodes[0].y}%`}
            x2={`${node.x}%`}    y2={`${node.y}%`}
            stroke="rgba(255,255,255,0.1)" strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.3 }}
          />
        ))}
      </svg>

      {nodes.map((node, i) => (
        <motion.div
          key={node.id}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.15, duration: 0.5 }}
        >
          <div className="flex flex-col items-center gap-1 sm:gap-2">
            <motion.div
              className={`relative flex size-8 sm:size-16 items-center justify-center rounded-full border-2 border-white/20 ${
                statusColors[node.status as keyof typeof statusColors]
              } shadow-lg`}
              animate={{ boxShadow: ["0 0 20px rgba(255,255,255,0.1)", "0 0 30px rgba(255,255,255,0.2)", "0 0 20px rgba(255,255,255,0.1)"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="size-2 sm:size-4 rounded-full bg-white" />
              {node.id === "original" && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-white/50"
                  animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>
            <span className="hidden sm:block whitespace-nowrap text-xs text-white/70">{node.label}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}