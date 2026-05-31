import { Link } from "react-router";
import { Github, FileText, Code, Chrome } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-black py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <p className="mb-8 text-2xl font-semibold text-white/80">
            "Authenticity is becoming infrastructure."
          </p>
        </div>

        <div className="mb-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Product */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/60">
              Product
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/verify" className="text-white/80 transition-colors hover:text-white">
                  Verify Media
                </Link>
              </li>
              <li>
                <Link to="/upload" className="text-white/80 transition-colors hover:text-white">
                  Upload Original
                </Link>
              </li>
              <li>
                <Link
                  to="/graph"
                  className="text-white/80 transition-colors hover:text-white"
                >
                  Provenance Graph
                </Link>
              </li>
              <li>
                <Link
                  to="/extension"
                  className="text-white/80 transition-colors hover:text-white"
                >
                  Browser Extension
                </Link>
              </li>
            </ul>
          </div>

          {/* Developers */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/60">
              Developers
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/api" className="text-white/80 transition-colors hover:text-white">
                  API Documentation
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 text-white/80 transition-colors hover:text-white"
                >
                  <Github className="size-4" />
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 text-white/80 transition-colors hover:text-white"
                >
                  <FileText className="size-4" />
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 text-white/80 transition-colors hover:text-white"
                >
                  <Code className="size-4" />
                  SDK
                </a>
              </li>
            </ul>
          </div>

          {/* Infrastructure */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/60">
              Infrastructure
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://sui.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 transition-colors hover:text-white"
                >
                  Sui Network
                </a>
              </li>
              <li>
                <a
                  href="https://walrus.xyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 transition-colors hover:text-white"
                >
                  Walrus Storage
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/60">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-white/80 transition-colors hover:text-white">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 transition-colors hover:text-white">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 transition-colors hover:text-white">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 transition-colors hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500">
              <span className="text-lg font-bold text-black">T</span>
            </div>
            <span className="text-xl font-semibold text-white">TRACE</span>
          </div>

          <div className="text-sm text-white/60">
            © 2026 TRACE. Authenticity infrastructure for the web.
          </div>

          <div className="flex gap-4">
            <a href="#" className="text-white/60 transition-colors hover:text-white">
              Privacy
            </a>
            <a href="#" className="text-white/60 transition-colors hover:text-white">
              Terms
            </a>
            <a href="#" className="text-white/60 transition-colors hover:text-white">
              Security
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}