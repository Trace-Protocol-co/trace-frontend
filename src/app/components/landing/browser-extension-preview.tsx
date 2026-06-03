import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { CheckCircle2, AlertCircle, Chrome } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";

export function BrowserExtensionPreview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const navigate = useNavigate();

  return (
    <section ref={ref} className="relative overflow-hidden bg-zinc-950 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div className="mb-10 sm:mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}>
          <h2 className="mb-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Verify Anywhere
          </h2>
          <p className="text-base sm:text-xl text-white/60">
            Browser extension for real-time verification across the web
          </p>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Mock Browser UI */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -40 }}
            transition={{ delay: 0.2, duration: 0.8 }}>
            <div className="overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-black shadow-2xl">
              {/* Browser chrome */}
              <div className="border-b border-white/10 bg-zinc-900 px-3 sm:px-4 py-2 sm:py-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex gap-1.5 sm:gap-2">
                    <div className="size-2.5 sm:size-3 rounded-full bg-red-500" />
                    <div className="size-2.5 sm:size-3 rounded-full bg-amber-500" />
                    <div className="size-2.5 sm:size-3 rounded-full bg-emerald-500" />
                  </div>
                  <div className="flex-1 rounded-lg bg-black px-2 sm:px-4 py-1.5 sm:py-2 font-mono text-[10px] sm:text-xs text-white/60 truncate">
                    https://twitter.com/news/video/123...
                  </div>
                </div>
              </div>

              {/* Mock content */}
              <div className="p-4 sm:p-6">
                <div className="mb-4 flex items-start gap-3">
                  <div className="size-8 sm:size-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="mb-1 flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-white text-sm sm:text-base">News Outlet</span>
                      <CheckCircle2 className="size-3.5 sm:size-4 text-blue-500 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-white/60">@newsoutlet · 2h</span>
                    </div>
                    <p className="mb-3 sm:mb-4 text-sm sm:text-base text-white/80">Breaking: Important event captured on video</p>
                    <div className="relative overflow-hidden rounded-xl bg-zinc-800">
                      <div className="aspect-video bg-gradient-to-br from-zinc-700 to-zinc-800" />
                      <motion.div className="absolute right-2 sm:right-3 top-2 sm:top-3"
                        initial={{ scale: 0 }}
                        animate={isInView ? { scale: 1 } : {}}
                        transition={{ delay: 0.6, type: "spring", stiffness: 200 }}>
                        <div className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-emerald-500/50 bg-emerald-500/20 px-2 sm:px-3 py-1 sm:py-1.5 backdrop-blur-sm">
                          <CheckCircle2 className="size-3 sm:size-4 text-emerald-400" />
                          <span className="text-[10px] sm:text-xs font-semibold text-emerald-400">VERIFIED</span>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Feature list */}
          <motion.div className="flex flex-col justify-center"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : 40 }}
            transition={{ delay: 0.4, duration: 0.8 }}>
            <div className="mb-6 sm:mb-8">
              <h3 className="mb-3 sm:mb-4 text-2xl sm:text-3xl font-bold text-white">
                Real-time Verification
              </h3>
              <p className="text-base sm:text-lg leading-relaxed text-white/70">
                Install the TRACE browser extension to see verification badges on social media,
                news websites, and anywhere media appears online.
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {[
                { icon: CheckCircle2, title: "Instant verification", description: "See authenticity scores without leaving the page" },
                { icon: AlertCircle,  title: "Manipulation alerts",  description: "Get notified when media has been altered or is unverified" },
                { icon: Chrome,       title: "Works everywhere",     description: "Compatible with Twitter, YouTube, news sites, and more" },
              ].map((feature, i) => (
                <motion.div key={feature.title}
                  className="flex gap-3 sm:gap-4 rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4 backdrop-blur-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
                  transition={{ delay: 0.6 + i * 0.1 }}>
                  <div className="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500">
                    <feature.icon className="size-4 sm:size-5 text-white" />
                  </div>
                  <div>
                    <div className="mb-0.5 font-semibold text-sm sm:text-base text-white">{feature.title}</div>
                    <div className="text-xs sm:text-sm text-white/60">{feature.description}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div className="mt-6 sm:mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: isInView ? 1 : 0 }}
              transition={{ delay: 1 }}>
              <Button size="lg" className="w-full sm:w-auto bg-white text-black hover:bg-white/90"
                onClick={() => navigate("/extension")}>
                Get Extension
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}