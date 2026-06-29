import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { AlertTriangle, XCircle, Sparkles, X, ExternalLink } from "lucide-react";
import { Button } from "../ui/button";

interface Notification {
  id: string;
  type: 'warning' | 'danger' | 'ai-generated';
  title: string;
  message: string;
  url: string;
  timestamp: number;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'ai-generated',
    title: 'AI-Generated Media Detected',
    message: 'The video on twitter.com appears to be AI-generated with 94% confidence.',
    url: 'twitter.com/user/status/123',
    timestamp: Date.now() - 2000,
  },
  {
    id: '2',
    type: 'danger',
    title: 'Unverified Content Alert',
    message: 'This media has no cryptographic proof and may be manipulated.',
    url: 'news-site.com/article',
    timestamp: Date.now() - 1000,
  },
];

export function ExtensionNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDemo, setShowDemo] = useState(true);

  useEffect(() => {
    if (showDemo) {
      const timer1 = setTimeout(() => {
        setNotifications([mockNotifications[0]]);
      }, 1000);

      const timer2 = setTimeout(() => {
        setNotifications([mockNotifications[0], mockNotifications[1]]);
      }, 3000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [showDemo]);

  const removeNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const getNotificationStyle = (type: Notification['type']) => {
    switch (type) {
      case 'ai-generated':
        return {
          bg: 'rgba(139, 92, 246, 0.1)',
          border: 'rgba(139, 92, 246, 0.3)',
          icon: Sparkles,
          iconColor: '#8b5cf6',
        };
      case 'warning':
        return {
          bg: 'rgba(245, 158, 11, 0.1)',
          border: 'rgba(245, 158, 11, 0.3)',
          icon: AlertTriangle,
          iconColor: '#f59e0b',
        };
      case 'danger':
        return {
          bg: 'rgba(239, 68, 68, 0.1)',
          border: 'rgba(239, 68, 68, 0.3)',
          icon: XCircle,
          iconColor: '#ef4444',
        };
    }
  };

  return (
    <div className="py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold mb-4">Smart Notifications</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
          Get real-time alerts when you encounter deepfakes, manipulated media, or unverified content.
          Customize notification settings to match your needs.
        </p>
        {notifications.length === 0 && showDemo && (
          <p className="text-sm text-muted-foreground/60">
            Demo notifications will appear shortly...
          </p>
        )}
      </motion.div>

      <div className="max-w-2xl mx-auto relative min-h-[300px]">
        {/* Mock browser window */}
        <div className="bg-card/30 backdrop-blur-xl border border-border/50 rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-unverified/50" />
            <div className="w-3 h-3 rounded-full bg-modified/50" />
            <div className="w-3 h-3 rounded-full bg-verified/50" />
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="h-4 bg-muted/20 rounded w-3/4" />
            <div className="h-4 bg-muted/20 rounded w-1/2" />
            <div className="h-4 bg-muted/20 rounded w-5/6" />
          </div>
        </div>

        {/* Notification Stack */}
        <div className="fixed top-4 right-4 z-50 space-y-3 w-96">
          <AnimatePresence mode="popLayout">
            {notifications.map((notification, index) => {
              const style = getNotificationStyle(notification.type);
              const Icon = style.icon;

              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: 300, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 300, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="bg-background/95 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden"
                  style={{
                    backgroundColor: style.bg,
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: style.border,
                  }}
                >
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${style.iconColor}30` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: style.iconColor }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-semibold text-sm">{notification.title}</h4>
                          <button
                            onClick={() => removeNotification(notification.id)}
                            className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-mono text-muted-foreground">{notification.url}</span>
                          <ExternalLink className="w-3 h-3 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 h-7 text-xs">
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="flex-1 h-7 text-xs"
                        onClick={() => removeNotification(notification.id)}
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <motion.div
                    className="h-1"
                    style={{ backgroundColor: style.iconColor }}
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: 5, ease: "linear" }}
                    onAnimationComplete={() => removeNotification(notification.id)}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Reset Demo Button */}
        {notifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-8"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setNotifications([]);
                setShowDemo(false);
                setTimeout(() => setShowDemo(true), 500);
              }}
            >
              Replay Demo
            </Button>
          </motion.div>
        )}
      </div>

      {/* Notification Settings Preview */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 max-w-2xl mx-auto"
      >
        <h3 className="text-xl font-bold mb-6 text-center">Customizable Alerts</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-card/50 border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-ai-generated" />
              <span className="font-semibold text-sm">AI-Generated Media</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Get notified when synthetic or AI-generated content is detected
            </p>
            <div className="text-xs text-muted-foreground">
              Confidence threshold: <span className="font-mono">85%+</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-card/50 border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-modified" />
              <span className="font-semibold text-sm">Modified Content</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Alert when heavily edited or manipulated media is found
            </p>
            <div className="text-xs text-muted-foreground">
              Similarity threshold: <span className="font-mono">&lt;70%</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-card/50 border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-4 h-4 text-unverified" />
              <span className="font-semibold text-sm">Unverified Media</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Notify when media has no cryptographic proof on-chain
            </p>
            <div className="text-xs text-muted-foreground">
              Status: <span className="font-mono">Optional</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-card/50 border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-modified" />
              <span className="font-semibold text-sm">Broken Provenance</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Alert when the authenticity chain cannot be verified
            </p>
            <div className="text-xs text-muted-foreground">
              Status: <span className="font-mono">Enabled</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
