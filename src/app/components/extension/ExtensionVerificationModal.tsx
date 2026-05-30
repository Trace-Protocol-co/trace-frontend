import { motion } from "motion/react";
import { useState } from "react";
import { X, CheckCircle2, AlertTriangle, ExternalLink, Clock, User, Hash, Download, Share2, Flag } from "lucide-react";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export function ExtensionVerificationModal() {
  const [isOpen, setIsOpen] = useState(true);

  // Mock data
  const verificationData = {
    status: 'modified' as const,
    title: 'News Photo - City Hall',
    similarity: '94.7%',
    firstSeen: '2024-03-15 14:32:18 UTC',
    creator: '0x7a9f...c4d2',
    currentEditor: '0x3b2e...8f1a',
    modifications: 3,
    suiTransaction: '0x9a7f2b3c...4d5e6f7g8h',
    walrusBlobId: 'blob_5f2d9a1b...c3e4f5g6h7',
    deviceSignature: 'Canon EOS R5',
    captureLocation: 'San Francisco, CA',
  };

  const editHistory = [
    {
      id: '1',
      action: 'Original Capture',
      editor: '0x7a9f...c4d2',
      timestamp: '2024-03-15 14:32:18',
      verified: true,
    },
    {
      id: '2',
      action: 'Color Correction',
      editor: '0x7a9f...c4d2',
      timestamp: '2024-03-15 15:45:22',
      verified: true,
    },
    {
      id: '3',
      action: 'Crop & Resize',
      editor: '0x3b2e...8f1a',
      timestamp: '2024-03-15 18:12:09',
      verified: true,
    },
    {
      id: '4',
      action: 'Metadata Edit',
      editor: '0x3b2e...8f1a',
      timestamp: '2024-03-16 09:22:41',
      verified: true,
    },
  ];

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-background border border-border/50 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-border/50 flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-modified/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-modified" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-1">{verificationData.title}</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-modified">MODIFIED BUT TRACEABLE</span>
                <span className="text-xs text-muted-foreground">• {verificationData.similarity} similarity</span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="w-full grid grid-cols-3 rounded-none border-b border-border/50">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="history">Edit History</TabsTrigger>
              <TabsTrigger value="provenance">Provenance</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="p-6 space-y-6">
              {/* Status Banner */}
              <div className="p-4 rounded-xl bg-modified/10 border border-modified/20">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-modified" />
                  <span className="text-sm font-semibold">Modifications Detected</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  This media has been edited {verificationData.modifications} times. All modifications are
                  cryptographically verified and traceable to their editors.
                </p>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    First Seen
                  </div>
                  <div className="text-sm font-mono">{verificationData.firstSeen}</div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <User className="w-3 h-3" />
                    Original Creator
                  </div>
                  <div className="text-sm font-mono">{verificationData.creator}</div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <User className="w-3 h-3" />
                    Current Editor
                  </div>
                  <div className="text-sm font-mono">{verificationData.currentEditor}</div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Hash className="w-3 h-3" />
                    Modifications
                  </div>
                  <div className="text-sm font-mono">{verificationData.modifications} edits</div>
                </div>
              </div>

              {/* Blockchain Data */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold">Blockchain Proof</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border/50">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Sui Transaction</div>
                      <div className="text-xs font-mono">{verificationData.suiTransaction}</div>
                    </div>
                    <ExternalLink className="w-3 h-3 text-muted-foreground" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border/50">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Walrus Blob ID</div>
                      <div className="text-xs font-mono">{verificationData.walrusBlobId}</div>
                    </div>
                    <ExternalLink className="w-3 h-3 text-muted-foreground" />
                  </div>
                </div>
              </div>

              {/* Device Info */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold">Capture Information</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-card/50 border border-border/50">
                    <div className="text-xs text-muted-foreground mb-1">Device</div>
                    <div className="text-sm">{verificationData.deviceSignature}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-card/50 border border-border/50">
                    <div className="text-xs text-muted-foreground mb-1">Location</div>
                    <div className="text-sm">{verificationData.captureLocation}</div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history" className="p-6">
              <div className="space-y-4">
                {editHistory.map((edit, index) => (
                  <motion.div
                    key={edit.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        edit.verified ? 'bg-verified/20' : 'bg-muted'
                      }`}>
                        {edit.verified && <CheckCircle2 className="w-4 h-4 text-verified" />}
                      </div>
                      {index < editHistory.length - 1 && (
                        <div className="w-px h-full bg-border/50 flex-1 mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm">{edit.action}</span>
                        <span className="text-xs text-muted-foreground">{edit.timestamp}</span>
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        by {edit.editor}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="provenance" className="p-6">
              <div className="aspect-square bg-card/50 rounded-xl border border-border/50 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <div className="text-4xl mb-2">📊</div>
                  <p className="text-sm">Interactive provenance graph</p>
                  <p className="text-xs mt-1">Shows full edit chain and derivatives</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border/50 bg-card/30 flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Download className="w-3 h-3 mr-2" />
            Download Report
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Share2 className="w-3 h-3 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Flag className="w-3 h-3 mr-2" />
            Report
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
