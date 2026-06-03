import { Link } from "react-router";
import { Github, ExternalLink } from "lucide-react";

const GITHUB = "https://github.com/anjolaoladele/trace-protocol";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-black py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <p className="text-lg sm:text-2xl font-semibold text-white/80">
            "Authenticity is becoming infrastructure."
          </p>
        </div>

        <div className="mb-12 grid gap-8 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">

          {/* Product */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/40">Product</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/verify" className="text-white/70 hover:text-white transition-colors">Verify Media</Link></li>
              <li><Link to="/upload" className="text-white/70 hover:text-white transition-colors">Register Media</Link></li>
              <li><Link to="/explorer" className="text-white/70 hover:text-white transition-colors">Explorer</Link></li>
              <li><Link to="/graph" className="text-white/70 hover:text-white transition-colors">Provenance Graph</Link></li>
              <li><Link to="/extension" className="text-white/70 hover:text-white transition-colors">Browser Extension</Link></li>
            </ul>
          </div>

          {/* Developers */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/40">Developers</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/api" className="text-white/70 hover:text-white transition-colors">API Docs</Link></li>
              <li>
                <a href={GITHUB} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                  <Github className="size-3.5" />GitHub
                </a>
              </li>
              <li>
                <a href="https://trace-cbvb.onrender.com/v1/health" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                  <ExternalLink className="size-3.5" />API Health
                </a>
              </li>
            </ul>
          </div>

          {/* Infrastructure */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/40">Infrastructure</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="https://sui.io" target="_blank" rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors">Sui Network</a>
              </li>
              <li>
                <a href="https://walrus.xyz" target="_blank" rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors">Walrus Storage</a>
              </li>
              <li>
                <a href="https://suiexplorer.com" target="_blank" rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors">Sui Explorer</a>
              </li>
              <li>
                <a href="https://walruscan.com/testnet" target="_blank" rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors">Walrus Scan</a>
              </li>
            </ul>
          </div>

          {/* Contract */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/40">On-Chain</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="https://suiexplorer.com/object/0x3eff0f24ece1bd96bef48ba534eb498331a87cb1fb90d30de5bf1ec940cc648e?network=testnet"
                  target="_blank" rel="noopener noreferrer"
                  className="text-white/70 hover:text-emerald-400 transition-colors font-mono text-xs">
                  Package: 0x3eff...648e
                </a>
              </li>
              <li>
                <a href="https://suiexplorer.com/object/0x5dcd795b9b23e0344608b92d58f2a0c0438558243ce5db9c821292f90df9a54a?network=testnet"
                  target="_blank" rel="noopener noreferrer"
                  className="text-white/70 hover:text-emerald-400 transition-colors font-mono text-xs">
                  Treasury: 0x5dcd...54a
                </a>
              </li>
              <li className="text-white/30 text-xs font-mono">Network: Sui Testnet</li>
              <li className="text-white/30 text-xs">Modules: media · delegation · staking</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500">
              <span className="text-lg font-bold text-black">T</span>
            </div>
            <span className="text-xl font-semibold text-white">TRACE</span>
          </Link>
          <div className="text-sm text-white/40 text-center">
            © 2026 TRACE Protocol · Built on Sui + Walrus · Sui Hackathon 2025
          </div>
          <div className="flex gap-4 text-sm">
            <a href={GITHUB} target="_blank" rel="noopener noreferrer"
              className="text-white/40 hover:text-white transition-colors">GitHub</a>
            <a href="https://trace-cbvb.onrender.com/v1/health" target="_blank" rel="noopener noreferrer"
              className="text-white/40 hover:text-white transition-colors">Status</a>
          </div>
        </div>
      </div>
    </div>
  );
}
  );
}