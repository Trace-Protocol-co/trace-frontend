import { motion } from "motion/react";
import { useState } from "react";
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from "lucide-react";
import { ExtensionBadge } from "./ExtensionBadge";

interface Post {
  id: string;
  platform: 'twitter' | 'instagram' | 'youtube';
  author: string;
  handle: string;
  content: string;
  timestamp: string;
  status: 'verified' | 'modified' | 'unverified' | 'ai-generated';
  hasMedia: boolean;
}

const mockPosts: Post[] = [
  {
    id: '1',
    platform: 'twitter',
    author: 'News Network',
    handle: '@newsnetwork',
    content: 'BREAKING: Major announcement from City Hall this morning. Full coverage at 6PM.',
    timestamp: '2h ago',
    status: 'verified',
    hasMedia: true,
  },
  {
    id: '2',
    platform: 'twitter',
    author: 'Tech Influencer',
    handle: '@techinfluencer',
    content: 'Check out this amazing product demo! The future is here 🚀',
    timestamp: '4h ago',
    status: 'ai-generated',
    hasMedia: true,
  },
  {
    id: '3',
    platform: 'twitter',
    author: 'Sports Reporter',
    handle: '@sportsreporter',
    content: 'Incredible moment from last night\'s game. What a play!',
    timestamp: '6h ago',
    status: 'modified',
    hasMedia: true,
  },
];

export function SocialMediaMock() {
  const [hoveredPost, setHoveredPost] = useState<string | null>(null);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {mockPosts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden"
          onMouseEnter={() => setHoveredPost(post.id)}
          onMouseLeave={() => setHoveredPost(null)}
        >
          {/* Twitter-like Header */}
          <div className="p-4 border-b border-border/50">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-verified to-protocol flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{post.author}</span>
                  <span className="text-muted-foreground text-sm">{post.handle}</span>
                  <span className="text-muted-foreground text-sm">· {post.timestamp}</span>
                </div>
                <p className="text-sm mt-2">{post.content}</p>
              </div>
              <MoreHorizontal className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            </div>
          </div>

          {/* Media Container with Badge */}
          {post.hasMedia && (
            <div
              className="relative aspect-video bg-gradient-to-br from-muted/30 to-muted/10 overflow-hidden"
            >
              {/* Mock media content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-muted-foreground/30 text-sm">
                  {post.platform.toUpperCase()} Media Content
                </div>
              </div>

              {/* TRACE Badge */}
              <ExtensionBadge
                status={post.status}
                position="top-right"
                size="md"
                showLabel={true}
                onClick={() => {}}
              />

              {/* Hover tooltip */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: hoveredPost === post.id ? 1 : 0,
                  y: hoveredPost === post.id ? 0 : 10,
                }}
                className="absolute bottom-4 left-4 right-4 bg-background/95 backdrop-blur-xl rounded-xl p-4 border border-border/50 pointer-events-none"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="text-sm font-semibold mb-2">
                      {post.status === 'verified' && 'Cryptographically Verified'}
                      {post.status === 'modified' && 'Modified but Traceable'}
                      {post.status === 'ai-generated' && 'AI Generated Content'}
                      {post.status === 'unverified' && 'Unverified Content'}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="text-muted-foreground">First seen</div>
                        <div className="font-mono">2024-03-15</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Creator</div>
                        <div className="font-mono">0x7a9f...c4d2</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Similarity</div>
                        <div className="font-mono">
                          {post.status === 'verified' && '100%'}
                          {post.status === 'modified' && '94.7%'}
                          {post.status === 'ai-generated' && 'N/A'}
                          {post.status === 'unverified' && '0%'}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Chain</div>
                        <div className="font-mono">Sui</div>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-protocol cursor-pointer hover:underline">
                      Click to view full provenance →
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Twitter-like Actions */}
          <div className="p-4 flex items-center justify-between border-t border-border/50">
            <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">24</span>
            </button>
            <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <Share2 className="w-5 h-5" />
              <span className="text-sm">12</span>
            </button>
            <button className="flex items-center gap-2 text-muted-foreground hover:text-verified transition-colors">
              <Heart className="w-5 h-5" />
              <span className="text-sm">156</span>
            </button>
            <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <Bookmark className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      ))}

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-protocol/10 to-verified/10 border border-protocol/20 rounded-xl p-6 text-center"
      >
        <h4 className="font-semibold mb-2">Real-time Verification Across the Web</h4>
        <p className="text-sm text-muted-foreground">
          TRACE automatically scans media on Twitter, YouTube, Instagram, Facebook, Reddit, news sites,
          and any webpage with media. Verification happens in milliseconds using on-chain proofs.
        </p>
      </motion.div>
    </div>
  );
}
