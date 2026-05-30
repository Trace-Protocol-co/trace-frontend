import { motion } from "motion/react";
import { CheckCircle2, AlertTriangle, XCircle, Sparkles } from "lucide-react";

interface ExtensionBadgeProps {
  status: 'verified' | 'modified' | 'unverified' | 'ai-generated';
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  onClick?: () => void;
}

const statusConfig = {
  verified: {
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.9)',
    icon: CheckCircle2,
    label: 'VERIFIED',
  },
  modified: {
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.9)',
    icon: AlertTriangle,
    label: 'MODIFIED',
  },
  unverified: {
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.9)',
    icon: XCircle,
    label: 'UNVERIFIED',
  },
  'ai-generated': {
    color: '#8b5cf6',
    bgColor: 'rgba(139, 92, 246, 0.9)',
    icon: Sparkles,
    label: 'AI GENERATED',
  },
};

const positionClasses = {
  'top-right': 'top-3 right-3',
  'top-left': 'top-3 left-3',
  'bottom-right': 'bottom-3 right-3',
  'bottom-left': 'bottom-3 left-3',
};

const sizeConfig = {
  sm: { icon: 12, padding: 'px-2 py-1', text: 'text-[9px]', gap: 'gap-1' },
  md: { icon: 14, padding: 'px-2.5 py-1.5', text: 'text-[10px]', gap: 'gap-1.5' },
  lg: { icon: 16, padding: 'px-3 py-2', text: 'text-xs', gap: 'gap-2' },
};

export function ExtensionBadge({
  status,
  position = 'top-right',
  size = 'md',
  showLabel = true,
  onClick,
}: ExtensionBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  const sizeStyles = sizeConfig[size];

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`absolute ${positionClasses[position]} z-10`}
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        onClick={onClick}
        className={`
          flex items-center ${sizeStyles.gap} ${sizeStyles.padding}
          rounded-lg backdrop-blur-xl cursor-pointer
          shadow-lg border border-black/20
          ${onClick ? 'hover:shadow-xl transition-shadow' : ''}
        `}
        style={{
          backgroundColor: config.bgColor,
        }}
      >
        <Icon
          className="flex-shrink-0 text-black"
          style={{ width: sizeStyles.icon, height: sizeStyles.icon }}
        />
        {showLabel && (
          <span className={`${sizeStyles.text} font-bold text-black whitespace-nowrap`}>
            {config.label}
          </span>
        )}
      </motion.div>

      {/* Pulse animation */}
      <motion.div
        className="absolute inset-0 rounded-lg"
        style={{
          border: `2px solid ${config.color}`,
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}
