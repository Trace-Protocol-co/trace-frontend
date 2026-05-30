import { motion } from "motion/react";
import { useState } from "react";
import { Shield, Bell, Eye, Lock, Globe, Zap, ChevronRight } from "lucide-react";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";

export function ExtensionSettings() {
  const [autoVerify, setAutoVerify] = useState(true);
  const [showBadges, setShowBadges] = useState(true);
  const [notifyDeepfakes, setNotifyDeepfakes] = useState(true);
  const [notifyUnverified, setNotifyUnverified] = useState(false);
  const [badgeSize, setBadgeSize] = useState([60]);
  const [confidenceThreshold, setConfidenceThreshold] = useState([70]);

  const whitelistedSites = [
    { domain: 'twitter.com', enabled: true },
    { domain: 'youtube.com', enabled: true },
    { domain: 'instagram.com', enabled: true },
    { domain: 'facebook.com', enabled: false },
    { domain: 'reddit.com', enabled: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-6 space-y-6"
    >
      {/* Auto-Verification */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-verified/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-verified" />
          </div>
          <div>
            <h3 className="font-semibold">Auto-Verification</h3>
            <p className="text-xs text-muted-foreground">Automatically scan media as you browse</p>
          </div>
        </div>
        <div className="space-y-3 pl-13">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-verify" className="text-sm">Enable auto-verification</Label>
            <Switch id="auto-verify" checked={autoVerify} onCheckedChange={setAutoVerify} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Confidence Threshold</Label>
            <Slider
              value={confidenceThreshold}
              onValueChange={setConfidenceThreshold}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Only verify when {confidenceThreshold[0]}% confident</span>
              <span>{confidenceThreshold[0]}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Badge Display */}
      <div className="pt-6 border-t border-border/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-protocol/20 flex items-center justify-center">
            <Eye className="w-5 h-5 text-protocol" />
          </div>
          <div>
            <h3 className="font-semibold">Badge Display</h3>
            <p className="text-xs text-muted-foreground">Customize verification badge appearance</p>
          </div>
        </div>
        <div className="space-y-3 pl-13">
          <div className="flex items-center justify-between">
            <Label htmlFor="show-badges" className="text-sm">Show badges on media</Label>
            <Switch id="show-badges" checked={showBadges} onCheckedChange={setShowBadges} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Badge Size</Label>
            <Slider
              value={badgeSize}
              onValueChange={setBadgeSize}
              max={100}
              step={1}
              className="w-full"
              disabled={!showBadges}
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Small</span>
              <span>Large</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="pt-6 border-t border-border/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-ai-generated/20 flex items-center justify-center">
            <Bell className="w-5 h-5 text-ai-generated" />
          </div>
          <div>
            <h3 className="font-semibold">Notifications</h3>
            <p className="text-xs text-muted-foreground">Get alerts for suspicious media</p>
          </div>
        </div>
        <div className="space-y-3 pl-13">
          <div className="flex items-center justify-between">
            <Label htmlFor="notify-deepfakes" className="text-sm">Alert on deepfakes</Label>
            <Switch id="notify-deepfakes" checked={notifyDeepfakes} onCheckedChange={setNotifyDeepfakes} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="notify-unverified" className="text-sm">Alert on unverified media</Label>
            <Switch id="notify-unverified" checked={notifyUnverified} onCheckedChange={setNotifyUnverified} />
          </div>
        </div>
      </div>

      {/* Whitelisted Sites */}
      <div className="pt-6 border-t border-border/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-modified/20 flex items-center justify-center">
            <Globe className="w-5 h-5 text-modified" />
          </div>
          <div>
            <h3 className="font-semibold">Enabled Sites</h3>
            <p className="text-xs text-muted-foreground">Choose which sites to scan</p>
          </div>
        </div>
        <div className="space-y-2 pl-13">
          {whitelistedSites.map((site) => (
            <div key={site.domain} className="flex items-center justify-between p-2 rounded-lg hover:bg-card/50">
              <span className="text-sm font-mono">{site.domain}</span>
              <Switch defaultChecked={site.enabled} />
            </div>
          ))}
        </div>
      </div>

      {/* Privacy */}
      <div className="pt-6 border-t border-border/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-unverified/20 flex items-center justify-center">
            <Lock className="w-5 h-5 text-unverified" />
          </div>
          <div>
            <h3 className="font-semibold">Privacy & Data</h3>
            <p className="text-xs text-muted-foreground">How TRACE handles your data</p>
          </div>
        </div>
        <div className="pl-13 space-y-3">
          <div className="p-3 rounded-lg bg-verified/10 border border-verified/20">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-verified" />
              <span className="text-sm font-semibold">Zero Tracking</span>
            </div>
            <p className="text-xs text-muted-foreground">
              All verification queries go directly to Sui blockchain. TRACE never sees your browsing
              history or personal data.
            </p>
          </div>
          <Button variant="outline" size="sm" className="w-full justify-between">
            <span>View Privacy Policy</span>
            <ChevronRight className="w-3 h-3" />
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-between">
            <span>Clear Verification History</span>
            <ChevronRight className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
