import { motion } from "motion/react";
import {
  Shield,
  Zap,
  Lock,
  Globe,
  Bell,
  BarChart3,
  Download,
  Share2,
  Eye,
  AlertTriangle,
  Sparkles,
  History,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant Verification",
    description: "Sub-second verification using perceptual hashing and cryptographic proofs from Sui blockchain",
    color: "verified",
  },
  {
    icon: Eye,
    title: "Real-time Badges",
    description: "See trust indicators directly on media across Twitter, YouTube, Instagram, news sites, and more",
    color: "protocol",
  },
  {
    icon: Shield,
    title: "Deepfake Detection",
    description: "AI-powered synthetic media detection with confidence scores and generation metadata analysis",
    color: "ai-generated",
  },
  {
    icon: History,
    title: "Provenance Explorer",
    description: "Interactive graph showing full edit history, modification chain, and cryptographic proofs",
    color: "modified",
  },
  {
    icon: Lock,
    title: "Zero Tracking",
    description: "All verification queries go directly to blockchain - we never see your browsing or personal data",
    color: "verified",
  },
  {
    icon: Globe,
    title: "Universal Coverage",
    description: "Works on any webpage with media - social networks, news sites, blogs, forums, and more",
    color: "protocol",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description: "Get notifications for deepfakes, manipulated media, or unverified content with custom thresholds",
    color: "ai-generated",
  },
  {
    icon: BarChart3,
    title: "Trust Analytics",
    description: "Track authenticity metrics for media you encounter - daily stats and verification history",
    color: "modified",
  },
  {
    icon: Download,
    title: "Export Reports",
    description: "Download detailed verification reports with blockchain proofs for legal or archival purposes",
    color: "verified",
  },
  {
    icon: Share2,
    title: "Share Verification",
    description: "Share verification results with others - help spread authentic, verified media",
    color: "protocol",
  },
  {
    icon: AlertTriangle,
    title: "Custom Warnings",
    description: "Set custom warning levels for different types of media manipulation or AI generation",
    color: "ai-generated",
  },
  {
    icon: Sparkles,
    title: "One-Click Verify",
    description: "Right-click any media file to check authenticity without leaving the page",
    color: "modified",
  },
];

export function ExtensionFeatures() {
  return (
    <div className="py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Everything you need to verify media authenticity across the entire web
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          const colorMap = {
            verified: '#10b981',
            modified: '#f59e0b',
            protocol: '#3b82f6',
            'ai-generated': '#8b5cf6',
          };
          const color = colorMap[feature.color as keyof typeof colorMap];

          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group bg-card/50 backdrop-blur-xl border border-border/50 rounded-xl p-6 hover:border-opacity-100 transition-all duration-300"
              style={{
                borderColor: `${color}20`,
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${color}20` }}
              >
                <Icon className="w-6 h-6" style={{ color }} />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
