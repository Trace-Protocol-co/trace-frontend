import { motion } from "motion/react";
import { useState } from "react";
import { Shield, Users, Plus, ExternalLink, CheckCircle2, Copy, Check } from "lucide-react";
import { Button } from "../components/ui/button";
import { isAuthenticated, getZkLoginAddress, initiateGoogleLogin } from "../lib/zklogin";
import { useNavigate } from "react-router";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className="font-mono text-[10px] text-white/30 hover:text-white/60 transition-colors">
      {copied ? "✓ COPIED" : "COPY"}
    </button>
  );
}

export function OrgPage() {
  const navigate = useNavigate();
  const authed = isAuthenticated();
  const address = getZkLoginAddress();

  // Register org state
  const [orgName, setOrgName] = useState("");
  const [orgResult, setOrgResult] = useState<{ org_id: string; sui_tx: string } | null>(null);
  const [orgLoading, setOrgLoading] = useState(false);
  const [orgError, setOrgError] = useState("");

  // Delegate state
  const [orgId, setOrgId] = useState("");
  const [delegateAddress, setDelegateAddress] = useState("");
  const [role, setRole] = useState("");
  const [delegateResult, setDelegateResult] = useState<{ delegation_id: string; sui_tx: string } | null>(null);
  const [delegateLoading, setDelegateLoading] = useState(false);
  const [delegateError, setDelegateError] = useState("");

  const registerOrg = async () => {
    if (!orgName.trim()) return;
    setOrgLoading(true); setOrgError("");
    try {
      const res = await fetch(API_URL + "/v1/org", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: orgName, creator_address: address }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to register org");
      setOrgResult(data);
    } catch (e: unknown) {
      setOrgError(e instanceof Error ? e.message : "Failed");
    } finally { setOrgLoading(false); }
  };

  const grantDelegate = async () => {
    if (!orgId.trim() || !delegateAddress.trim() || !role.trim()) return;
    setDelegateLoading(true); setDelegateError("");
    try {
      const res = await fetch(API_URL + "/v1/delegate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          org_id: orgId, delegate: delegateAddress,
          role, creator_address: address,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to grant delegation");
      setDelegateResult(data);
    } catch (e: unknown) {
      setDelegateError(e instanceof Error ? e.message : "Failed");
    } finally { setDelegateLoading(false); }
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <motion.div className="max-w-md w-full text-center"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-6 inline-flex size-16 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <Shield className="size-8 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Organisation Hub</h1>
          <p className="text-white/60 mb-8">
            Register your organisation on Sui and delegate signing authority to your team.
            Sign in with Google to continue.
          </p>
          <Button className="bg-white text-black hover:bg-white/90 font-semibold w-full"
            onClick={initiateGoogleLogin}>
            Sign In with Google
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 sm:py-24">

        {/* Header */}
        <motion.div className="mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs text-white/60">
            <Shield className="size-3 text-emerald-500" />
            Organisation & Delegation
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">Organisation Hub</h1>
          <p className="text-white/60 max-w-xl">
            Register your organisation on Sui blockchain and delegate signing authority to reporters,
            photographers, and editors. All delegation records are immutable and publicly verifiable.
          </p>
        </motion.div>

        {/* How it works */}
        <motion.div className="mb-10 grid gap-4 sm:grid-cols-3"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          {[
            { icon: Shield, step: "01", title: "Register Org", desc: "Create an OrgRoot object on Sui. This is your organisation's on-chain identity." },
            { icon: Users, step: "02", title: "Delegate Authority", desc: "Issue DelegationRecord objects to reporters. They register media under your brand." },
            { icon: CheckCircle2, step: "03", title: "Verify Delegation", desc: "Anyone can verify a reporter's delegation traces back to your OrgRoot." },
          ].map((item) => (
            <div key={item.step} className="rounded-xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="font-mono text-xs text-white/30">{item.step}</span>
                <item.icon className="size-4 text-emerald-500" />
              </div>
              <div className="font-semibold text-sm mb-1">{item.title}</div>
              <div className="text-xs text-white/50">{item.desc}</div>
            </div>
          ))}
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2">

          {/* Register Organisation */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <Plus className="size-5 text-emerald-500" />
                </div>
                <div>
                  <div className="font-semibold">Register Organisation</div>
                  <div className="text-xs text-white/40">Creates OrgRoot on Sui</div>
                </div>
              </div>

              {!orgResult ? (
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm text-white/60">Organisation Name</label>
                    <input value={orgName} onChange={e => setOrgName(e.target.value)}
                      placeholder="e.g. Reuters Africa, BBC News"
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30" />
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                    <div className="text-xs text-white/40 mb-1">Authority Address</div>
                    <div className="font-mono text-xs text-cyan-400 truncate">{address}</div>
                  </div>
                  {orgError && <div className="text-xs text-red-400">{orgError}</div>}
                  <Button onClick={registerOrg} disabled={!orgName.trim() || orgLoading}
                    className="w-full bg-white text-black hover:bg-white/90 font-semibold">
                    {orgLoading ? "Registering..." : "Register on Sui"}
                  </Button>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-4">
                    <CheckCircle2 className="size-5" />
                    Organisation registered!
                  </div>
                  <div>
                    <div className="text-xs text-white/40 mb-1">Org ID (save this)</div>
                    <div className="flex items-center gap-2 font-mono text-xs text-white/70">
                      <span className="truncate">{orgResult.org_id}</span>
                      <CopyBtn text={orgResult.org_id} />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-white/40 mb-1">Sui Transaction</div>
                    <div className="flex items-center gap-2 font-mono text-xs text-cyan-400">
                      <span className="truncate">{orgResult.sui_tx}</span>
                      <a href={`https://suiexplorer.com/txblock/${orgResult.sui_tx}?network=testnet`}
                        target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="size-3" />
                      </a>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full border-white/20 text-white mt-2"
                    onClick={() => { setOrgResult(null); setOrgName(""); }}>
                    Register Another
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Grant Delegation */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="size-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Users className="size-5 text-blue-400" />
                </div>
                <div>
                  <div className="font-semibold">Grant Delegation</div>
                  <div className="text-xs text-white/40">Issue DelegationRecord to reporter</div>
                </div>
              </div>

              {!delegateResult ? (
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm text-white/60">Your Org ID</label>
                    <input value={orgId} onChange={e => setOrgId(e.target.value)}
                      placeholder="0x... from registration above"
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 font-mono text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-white/30" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm text-white/60">Reporter Wallet Address</label>
                    <input value={delegateAddress} onChange={e => setDelegateAddress(e.target.value)}
                      placeholder="0x... reporter's Sui address"
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 font-mono text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-white/30" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm text-white/60">Role</label>
                    <input value={role} onChange={e => setRole(e.target.value)}
                      placeholder="e.g. Lagos Bureau Reporter"
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30" />
                  </div>
                  {delegateError && <div className="text-xs text-red-400">{delegateError}</div>}
                  <Button onClick={grantDelegate}
                    disabled={!orgId.trim() || !delegateAddress.trim() || !role.trim() || delegateLoading}
                    className="w-full bg-white text-black hover:bg-white/90 font-semibold">
                    {delegateLoading ? "Issuing..." : "Issue Delegation"}
                  </Button>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="space-y-3">
                  <div className="flex items-center gap-2 text-blue-400 font-semibold mb-4">
                    <CheckCircle2 className="size-5" />
                    Delegation granted!
                  </div>
                  <div>
                    <div className="text-xs text-white/40 mb-1">Delegation ID</div>
                    <div className="flex items-center gap-2 font-mono text-xs text-white/70">
                      <span className="truncate">{delegateResult.delegation_id}</span>
                      <CopyBtn text={delegateResult.delegation_id} />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-white/40 mb-1">Sui Transaction</div>
                    <div className="flex items-center gap-2 font-mono text-xs text-cyan-400">
                      <span className="truncate">{delegateResult.sui_tx}</span>
                      <a href={`https://suiexplorer.com/txblock/${delegateResult.sui_tx}?network=testnet`}
                        target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="size-3" />
                      </a>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full border-white/20 text-white mt-2"
                    onClick={() => { setDelegateResult(null); setOrgId(""); setDelegateAddress(""); setRole(""); }}>
                    Grant Another
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {/* What this means */}
        <motion.div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <h3 className="font-semibold mb-4 text-white">Why this matters</h3>
          <div className="grid gap-4 sm:grid-cols-3 text-sm text-white/60">
            <div>
              <div className="text-white font-medium mb-1">For newsrooms</div>
              Every photo your journalists submit is cryptographically linked to your organisation's identity — permanently on-chain.
            </div>
            <div>
              <div className="text-white font-medium mb-1">For courts</div>
              Digital evidence with a verifiable delegation chain — proving the journalist who shot the footage was authorised by the outlet.
            </div>
            <div>
              <div className="text-white font-medium mb-1">Revocation</div>
              If a reporter leaves, revoke their delegation. Past content stays valid — future registrations are blocked.
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}