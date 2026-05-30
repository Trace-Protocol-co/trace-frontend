import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  Node,
  Edge,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import { Badge } from "../ui/badge";
import { Clock, User, Sparkles } from "lucide-react";

const initialNodes: Node[] = [
  {
    id: "original",
    type: "custom",
    position: { x: 400, y: 50 },
    data: {
      label: "ORIGINAL MEDIA",
      status: "verified",
      timestamp: "2026-05-20 14:32:15",
      editor: "0x7a8f...9b2c",
      modification: "Source",
    },
  },
  {
    id: "trimmed",
    type: "custom",
    position: { x: 150, y: 250 },
    data: {
      label: "TRIMMED VERSION",
      status: "modified",
      timestamp: "2026-05-21 09:15:42",
      editor: "0x3c5d...1e4f",
      modification: "Duration: -15s",
    },
  },
  {
    id: "graded",
    type: "custom",
    position: { x: 350, y: 250 },
    data: {
      label: "COLOR GRADED",
      status: "modified",
      timestamp: "2026-05-21 11:22:08",
      editor: "0x9a2b...6f3e",
      modification: "Color adjustment",
    },
  },
  {
    id: "reupload",
    type: "custom",
    position: { x: 550, y: 250 },
    data: {
      label: "REUPLOADED",
      status: "verified",
      timestamp: "2026-05-22 16:45:30",
      editor: "0x7a8f...9b2c",
      modification: "Exact copy",
    },
  },
  {
    id: "faceswap",
    type: "custom",
    position: { x: 225, y: 400 },
    data: {
      label: "AI FACE SWAP",
      status: "synthetic",
      timestamp: "2026-05-23 10:05:19",
      editor: "0x1f8e...4a9d",
      modification: "AI manipulation",
    },
  },
  {
    id: "screen",
    type: "custom",
    position: { x: 475, y: 400 },
    data: {
      label: "SCREEN RECORDING",
      status: "unverified",
      timestamp: "2026-05-24 08:30:55",
      editor: "Unknown",
      modification: "Screen capture",
    },
  },
];

const initialEdges: Edge[] = [
  { id: "e1", source: "original", target: "trimmed", animated: true },
  { id: "e2", source: "original", target: "graded", animated: true },
  { id: "e3", source: "original", target: "reupload", animated: true },
  { id: "e4", source: "trimmed", target: "faceswap", animated: true },
  { id: "e5", source: "graded", target: "screen", animated: true },
];

const statusConfig = {
  verified: {
    color: "bg-emerald-500",
    border: "border-emerald-500",
    text: "text-emerald-500",
    label: "VERIFIED ORIGINAL",
  },
  modified: {
    color: "bg-amber-500",
    border: "border-amber-500",
    text: "text-amber-500",
    label: "MODIFIED BUT TRACEABLE",
  },
  unverified: {
    color: "bg-red-500",
    border: "border-red-500",
    text: "text-red-500",
    label: "UNVERIFIED",
  },
  synthetic: {
    color: "bg-violet-500",
    border: "border-violet-500",
    text: "text-violet-500",
    label: "AI GENERATED",
  },
};

function CustomNode({ data }: { data: any }) {
  const [isHovered, setIsHovered] = useState(false);
  const config = statusConfig[data.status as keyof typeof statusConfig];

  return (
    <motion.div
      className="relative"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div
        className={`min-w-48 rounded-xl border-2 ${config.border} bg-black p-4 shadow-2xl`}
      >
        <div className="mb-3 flex items-center justify-between">
          <Badge className={`${config.color} border-0 text-xs text-white`}>
            {data.status.toUpperCase()}
          </Badge>
          <motion.div
            className={`size-3 rounded-full ${config.color}`}
            animate={{
              boxShadow: [
                `0 0 0 0 ${config.color}`,
                `0 0 0 8px rgba(255,255,255,0)`,
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        
        <div className="mb-2 text-sm font-bold text-white">{data.label}</div>
        <div className="text-xs text-white/60">{data.modification}</div>
      </div>

      {/* Hover card */}
      {isHovered && (
        <motion.div
          className="absolute left-full top-0 z-50 ml-4 w-72 rounded-xl border border-white/20 bg-black/95 p-4 shadow-2xl backdrop-blur-xl"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="mb-4 border-b border-white/10 pb-3">
            <div className={`mb-2 text-xs font-bold ${config.text}`}>
              {config.label}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Clock className="mt-0.5 size-3.5 text-white/40" />
              <div>
                <div className="text-xs text-white/40">Timestamp</div>
                <div className="text-xs text-white">{data.timestamp}</div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <User className="mt-0.5 size-3.5 text-white/40" />
              <div>
                <div className="text-xs text-white/40">Editor Identity</div>
                <div className="font-mono text-xs text-white">{data.editor}</div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Sparkles className="mt-0.5 size-3.5 text-white/40" />
              <div>
                <div className="text-xs text-white/40">Modification Type</div>
                <div className="text-xs text-white">{data.modification}</div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-3">
              <div className="mb-1 text-xs text-white/40">Sui Transaction</div>
              <div className="font-mono text-xs text-cyan-400">
                0xf7a9b2c8e1d4f6a3...
              </div>
            </div>

            <div>
              <div className="mb-1 text-xs text-white/40">Walrus Blob ID</div>
              <div className="font-mono text-xs text-blue-400">
                blob_8x9a2f5c7e1b...
              </div>
            </div>

            <div>
              <div className="mb-1 text-xs text-white/40">Similarity Score</div>
              <div className="text-xs text-white">
                {data.status === "verified" ? "100%" : data.status === "modified" ? "94%" : data.status === "synthetic" ? "67%" : "Unknown"}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

const nodeTypes = {
  custom: CustomNode,
};

export function ProvenanceGraphDemo() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="relative overflow-hidden bg-zinc-950 py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="mb-4 text-5xl font-bold tracking-tight text-white">
            Provenance Graph
          </h2>
          <p className="text-xl text-white/60">
            Interactive visualization of media edit history
          </p>
        </motion.div>

        <motion.div
          className="overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: isInView ? 1 : 0, scale: isInView ? 1 : 0.95 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="h-[600px]">
            <ReactFlow
              nodes={initialNodes}
              edges={initialEdges}
              nodeTypes={nodeTypes}
              fitView
              className="bg-black"
              proOptions={{ hideAttribution: true }}
            >
              <Background color="#ffffff10" gap={32} />
              <Controls className="rounded-lg border border-white/10 bg-black/80 backdrop-blur-sm [&_button]:text-white/70 [&_button:hover]:bg-white/10 [&_button:hover]:text-white" />
            </ReactFlow>
          </div>
        </motion.div>

        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <p className="text-sm text-white/40">
            Hover over nodes to view detailed cryptographic proofs and metadata
          </p>
        </motion.div>
      </div>
    </section>
  );
}
