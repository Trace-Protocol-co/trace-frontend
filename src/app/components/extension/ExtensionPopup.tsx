import { motion } from "motion/react";
import { useState } from "react";
import { Shield, Upload, History, TrendingUp, CheckCircle2, AlertTriangle, XCircle, Sparkles, ExternalLink, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface ScanItem {
  id: string;
  url: string;
  status: 'verified' | 'modified' | 'unverified' | 'ai-generated';
  timestamp: string;
  source: string;
}

const recentScans: ScanItem[] = [
  {
    id: '1',
    url: 'twitter.com/user/status/123',
    status: 'verified',
    timestamp: '2 min ago',
    source: 'Twitter',
  },
  {
    id: '2',
    url: 'youtube.com/watch?v=abc',
    status: 'modified',
    timestamp: '15 min ago',
    source: 'YouTube',
  },
  {
    id: '3',
    url: 'news-site.com/article',
    status: 'ai-generated',
    timestamp: '1 hour ago',
    source: 'News Site',
  },
  {
    id: '4',
    url: 'instagram.com/p/xyz',
    status: 'verified',
    timestamp: '2 hours ago',
    source: 'Instagram',
  },
];

const statusConfig = {
  verified: { color: '#10b981', icon: CheckCircle2, label: 'Verified' },
  modified: { color: '#f59e0b', icon: AlertTriangle, label: 'Modified' },
  unverified: { color: '#ef4444', icon: XCircle, label: 'Unverified' },
  'ai-generated': { color: '#8b5cf6', icon: Sparkles, label: 'AI Generated' },
};

export function ExtensionPopup() {
  const [activeTab, setActiveTab] = useState("recent");

  const todayStats = {
    verified: 24,
    modified: 5,
    unverified: 2,
    aiGenerated: 3,
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-[380px] bg-background border-2 border-border/50 rounded-xl shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-card to-card/50 border-b border-border/50 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-verified/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-verified" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg">TRACE</h3>
            <p className="text-xs text-muted-foreground">Media Verification</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Today</div>
            <div className="text-sm font-bold text-verified">{todayStats.verified} verified</div>
          </div>
        </div>

        {/* Quick Verify */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Paste URL or drop media..."
            className="pl-10 bg-background/50 border-border/50"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-2 rounded-none border-b border-border/50 bg-transparent">
          <TabsTrigger value="recent" className="rounded-none">
            <History className="w-3 h-3 mr-2" />
            Recent
          </TabsTrigger>
          <TabsTrigger value="stats" className="rounded-none">
            <TrendingUp className="w-3 h-3 mr-2" />
            Stats
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="mt-0 max-h-[400px] overflow-y-auto">
          <div className="divide-y divide-border/50">
            {recentScans.map((scan, index) => {
              const Icon = statusConfig[scan.status].icon;
              return (
                <motion.div
                  key={scan.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 hover:bg-card/30 cursor-pointer transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${statusConfig[scan.status].color}20` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: statusConfig[scan.status].color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold truncate">{scan.source}</span>
                        <span className="text-xs text-muted-foreground">{scan.timestamp}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{scan.url}</p>
                      <span
                        className="text-xs font-medium"
                        style={{ color: statusConfig[scan.status].color }}
                      >
                        {statusConfig[scan.status].label}
                      </span>
                    </div>
                    <ExternalLink className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="stats" className="mt-0 p-4">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold mb-3">Today's Activity</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-verified/10 border border-verified/20">
                  <div className="text-2xl font-bold text-verified mb-1">{todayStats.verified}</div>
                  <div className="text-xs text-muted-foreground">Verified</div>
                </div>
                <div className="p-3 rounded-xl bg-modified/10 border border-modified/20">
                  <div className="text-2xl font-bold text-modified mb-1">{todayStats.modified}</div>
                  <div className="text-xs text-muted-foreground">Modified</div>
                </div>
                <div className="p-3 rounded-xl bg-unverified/10 border border-unverified/20">
                  <div className="text-2xl font-bold text-unverified mb-1">{todayStats.unverified}</div>
                  <div className="text-xs text-muted-foreground">Unverified</div>
                </div>
                <div className="p-3 rounded-xl bg-ai-generated/10 border border-ai-generated/20">
                  <div className="text-2xl font-bold text-ai-generated mb-1">{todayStats.aiGenerated}</div>
                  <div className="text-xs text-muted-foreground">AI Generated</div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border/50">
              <h4 className="text-sm font-semibold mb-2">Trust Score</h4>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-verified to-protocol"
                    initial={{ width: 0 }}
                    animate={{ width: '71%' }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </div>
                <span className="text-sm font-bold">71%</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Of media you've seen today is cryptographically verified
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Footer Actions */}
      <div className="border-t border-border/50 p-3 bg-card/30 flex gap-2">
        <Button variant="outline" size="sm" className="flex-1 text-xs">
          <Upload className="w-3 h-3 mr-2" />
          Upload
        </Button>
        <Button size="sm" className="flex-1 bg-protocol hover:bg-protocol/90 text-white text-xs">
          Settings
        </Button>
      </div>
    </motion.div>
  );
}
