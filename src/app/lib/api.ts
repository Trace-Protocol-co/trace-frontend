/**
 * TRACE — API Client
 */

const API = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

export type Verdict = "VERIFIED_ORIGINAL" | "MODIFIED" | "UNVERIFIED" | "AI_GENERATED" | "UNKNOWN";

export interface BankInfo {
  sighting_id?:        string;
  contributed_to_bank: boolean;
  bank_blob_id?:       string | null;
  known?:              boolean;
  sighting_count?:     number;
  first_seen?:         string;
  sources?:            string[];
  message?:            string;
}

export interface VerifyResult {
  verdict: Verdict;
  confidence: number;
  origin: { first_seen: string; creator: string; sui_tx: string; walrus_blob: string } | null;
  provenance_chain: ChainNode[];
  similarity_matches: { blob_id: string; similarity: number; relationship: string }[];
  bank?: BankInfo;
  ai_score?: number;
  flags: string[];
}

export interface RegisterResult {
  media_id: string;
  walrus_blob: string;
  certificate_url: string;
  sui_tx: string;
  timestamp: number;
}

export interface ChainNode {
  mediaId?: string;
  type: number | string;
  integrity: 0 | 1 | 2 | 3;
  creator?: string;
  timestamp?: string;
  revoked?: boolean;
}

export interface GraphNode {
  mediaId: string;
  editType: number;
  integrity: 0 | 1 | 2 | 3;
  creator: string;
  timestamp: number;
  blobId: string;
  suiTx: string;
  aiScore: number;
  revoked: boolean;
  parentId?: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: { from: string; to: string; type: string }[];
}

export async function computeSHA256(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hash = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function computePHash(sha256Hex: string): string {
  const bytes = sha256Hex.match(/.{2}/g)!.map((h) => parseInt(h, 16));
  return bytes.slice(0, 16).map((b, i) => b ^ bytes[i + 16]).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function verifyMedia(file: File): Promise<VerifyResult> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch(`${API}/v1/verify`, { method: "POST", body: fd });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? `Verification failed (${res.status})`);
  return data;
}

export async function registerMedia(params: {
  file: File; editType: string; aiScore: string; description: string; parentId?: string;
  creatorAddress?: string; creatorEmail?: string;
}): Promise<RegisterResult> {
  const fd = new FormData();
  fd.append("file", params.file);
  fd.append("edit_type", params.editType);
  fd.append("ai_score", params.aiScore);
  fd.append("description", params.description);
  if (params.parentId?.trim()) fd.append("parent_id", params.parentId.trim());
  if (params.creatorAddress) fd.append("creator_address", params.creatorAddress);
  if (params.creatorEmail)   fd.append("creator_email", params.creatorEmail);
  const res = await fetch(`${API}/v1/register`, { method: "POST", body: fd });
  const data = await res.json();
  if (res.status === 409) {
    // Duplicate registration — throw with full data so UI can show existing record
    const err = new Error("already_registered") as Error & { data: typeof data };
    err.data = data;
    throw err;
  }
  if (!res.ok) throw new Error(data.error ?? `Registration failed (${res.status})`);
  return data;
}

export async function fetchGraph(mediaId: string): Promise<GraphData> {
  const res = await fetch(`${API}/v1/media/${mediaId}/graph`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? `Graph fetch failed (${res.status})`);
  return data;
}

export async function fetchHealth(): Promise<{ status: string; registered: number; network: string }> {
  const res = await fetch(`${API}/v1/health`);
  return res.json();
}