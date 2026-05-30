import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { CheckCircle2, AlertCircle, Chrome } from "lucide-react";
import { Button } from "../ui/button";

export function BrowserExtensionPreview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="relative overflow-hidden bg-zinc-950 py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="mb-4 text-5xl font-bold tracking-tight text-white">
            Verify Anywhere
          </h2>
          <p className="text-xl text-white/60">
            Browser extension for real-time verification across the web
          </p>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Mock Browser UI */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -40 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
              {/* Browser chrome */}
              <div className="border-b border-white/10 bg-zinc-900 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="size-3 rounded-full bg-red-500" />
                    <div className="size-3 rounded-full bg-amber-500" />
                    <div className="size-3 rounded-full bg-emerald-500" />
                  </div>
                  <div className="flex-1 rounded-lg bg-black px-4 py-2 font-mono text-xs text-white/60">
                    https://twitter.com/news/video/123...
                  </div>
                </div>
              </div>

              {/* Mock Twitter/X post */}
              <div className="p-6">
                <div className="mb-4 flex items-start gap-3">
                  <div className="size-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="font-semibold text-white">News Outlet</span>
                      <CheckCircle2 className="size-4 text-blue-500" />
                      <span className="text-sm text-white/60">@newsoutlet · 2h</span>
                    </div>
                    <p className="mb-4 text-white/80">
                      Breaking: Important event captured on video
                    </p>
                    
                    {/* Mock video with TRACE badge */}
                    <div className="relative overflow-hidden rounded-xl bg-zinc-800">
                      <div className="aspect-video bg-gradient-to-br from-zinc-700 to-zinc-800" />
                      
                      {/* TRACE verification badge */}
                      <motion.div
                        className="absolute right-3 top-3"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={isInView ? { scale: 1, rotate: 0 } : {}}
                        transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                      >
                        <div className="flex items-center gap-2 rounded-full border border-emerald-500/50 bg-emerald-500/20 px-3 py-1.5 backdrop-blur-sm">
                          <CheckCircle2 className="size-4 text-emerald-400" />
                          <span className="text-xs font-semibold text-emerald-400">
                            VERIFIED
                          </span>
                        </div>
                      </motion.div>

                      {/* Hover popup preview */}
                      <motion.div
                        className="absolute right-3 top-14 w-72 rounded-xl border border-white/20 bg-black/95 p-4 shadow-2xl backdrop-blur-xl"
                        initial={{ opacity: 0, y: -10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 1, duration: 0.4 }}
                      >
                        <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3">
                          <div className="text-sm font-bold text-white">
                            TRACE Verification
                          </div>
                          <div className="flex size-6 items-center justify-center rounded bg-gradient-to-br from-emerald-500 to-cyan-500">
                            <span className="text-xs font-bold text-white">T</span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <div className="mb-1 text-xs text-white/40">Authenticity Score</div>
                            <div className="flex items-center gap-2">
                              <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                                <motion.div
                                  className="h-full bg-emerald-500"
                                  initial={{ width: 0 }}
                                  animate={isInView ? { width: "100%" } : {}}
                                  transition={{ delay: 1.2, duration: 0.8 }}
                                />
                              </div>
                              <span className="text-sm font-semibold text-emerald-400">100%</span>
                            </div>
                          </div>

                          <div>
                            <div className="mb-1 text-xs text-white/40">Origin Timestamp</div>
                            <div className="font-mono text-xs text-white">
                              2026-05-20 14:32:15 UTC
                            </div>
                          </div>

                          <div>
                            <div className="mb-1 text-xs text-white/40">Edit History</div>
                            <div className="text-xs text-white">No modifications detected</div>
                          </div>

                          <Button
                            size="sm"
                            className="w-full bg-white text-black hover:bg-white/90"
                          >
                            View Full Provenance
                          </Button>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Feature list */}
          <motion.div
            className="flex flex-col justify-center"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : 40 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="mb-8">
              <h3 className="mb-4 text-3xl font-bold text-white">
                Real-time Verification
              </h3>
              <p className="text-lg leading-relaxed text-white/70">
                Install the TRACE browser extension to see verification badges on social media,
                news websites, and anywhere media appears online.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: CheckCircle2,
                  title: "Instant verification",
                  description: "See authenticity scores without leaving the page",
                },
                {
                  icon: AlertCircle,
                  title: "Manipulation alerts",
                  description: "Get notified when media has been altered or is unverified",
                },
                {
                  icon: Chrome,
                  title: "Works everywhere",
                  description: "Compatible with Twitter, YouTube, news sites, and more",
                },
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  className="flex gap-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
                  transition={{ delay: 0.6 + i * 0.1, duration: 0.6 }}
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500">
                    <feature.icon className="size-5 text-white" />
                  </div>
                  <div>
                    <div className="mb-1 font-semibold text-white">{feature.title}</div>
                    <div className="text-sm text-white/60">{feature.description}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: isInView ? 1 : 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <Button size="lg" className="bg-white text-black hover:bg-white/90">
                Download Extension
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
