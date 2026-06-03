import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ZkLoginButton } from "./zklogin-button";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { to: "/",          label: "Home" },
  { to: "/verify",    label: "Verify" },
  { to: "/upload",    label: "Upload" },
  { to: "/explorer",  label: "Explorer" },
  { to: "/extension", label: "Extension" },
  { to: "/api",       label: "API" },
];

export function Root() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className={`fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-xl transition-shadow ${scrolled ? "shadow-lg shadow-black/50" : ""}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500">
                <span className="text-lg font-bold text-black">T</span>
              </div>
              <span className="text-xl font-semibold tracking-tight">TRACE</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              {NAV_LINKS.map((l) => (
                <Link key={l.to} to={l.to}
                  className={`text-sm transition-colors hover:text-white ${
                    location.pathname === l.to ? "text-white font-medium" : "text-white/70"
                  }`}>
                  {l.label}
                </Link>
              ))}
            </div>

            {/* Desktop right — zkLogin only, no Get Started button */}
            <div className="hidden md:flex items-center">
              <ZkLoginButton />
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden border-t border-white/10 bg-black/95"
            >
              <div className="mx-auto max-w-7xl px-4 py-4 space-y-1">
                {NAV_LINKS.map((l) => (
                  <Link key={l.to} to={l.to}
                    className={`block px-3 py-3 rounded-lg text-sm transition-colors hover:bg-white/5 hover:text-white ${
                      location.pathname === l.to ? "text-white bg-white/5" : "text-white/70"
                    }`}>
                    {l.label}
                  </Link>
                ))}
                {/* zkLogin visible on mobile */}
                <div className="pt-3 border-t border-white/10">
                  <ZkLoginButton className="w-full justify-center" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <div className="pt-16">
        <Outlet />
      </div>
    </div>
  );
}