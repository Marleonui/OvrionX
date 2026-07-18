import { LLMClient } from "../llm/llm-client";
import type { MemoryEntry } from "../types";

/**
 * MemoryManager handles storing and retrieving context memories.
 * In-memory vector store for MVP — replaceable with Pinecone/Pgvector later.
 */
export class MemoryManager {
  private llm: LLMClient;
  private memories: Map<string, MemoryEntry[]> = new Map();
  private embeddings: Map<string, number[]> = new Map();

  constructor(llm: LLMClient) {
    this.llm = llm;
  }

  /**
   * Store a memory entry with automatic embedding
   */
  async store(entry: MemoryEntry): Promise<void> {
    const userId = entry.userId;

    if (!this.memories.has(userId)) {
      this.memories.set(userId, []);
    }

    this.memories.get(userId)!.push(entry);

    // Generate and cache embedding for search
    try {
      const embedding = await this.llm.createEmbedding(entry.content);
      this.embeddings.set(entry.id, embedding);
    } catch {
      // Embedding failed — search will fall back to text matching
    }

    // Enforce memory limit (keep last 500 entries per user)
    const userMemories = this.memories.get(userId)!;
    if (userMemories.length > 500) {
      this.memories.set(userId, userMemories.slice(-500));
    }
  }

  /**
   * Search memories by semantic similarity (uses embeddings when available)
   */
  async search(
    userId: string,
    query: string,
    limit: number = 5
  ): Promise<MemoryEntry[]> {
    const userMemories = this.memories.get(userId);
    if (!userMemories || userMemories.length === 0) {
      return [];
    }

    try {
      const queryEmbedding = await this.llm.createEmbedding(query);
      return this.searchByVector(userMemories, queryEmbedding, limit);
    } catch {
      // Fallback to keyword search when embeddings fail
      return this.searchByKeywords(userMemories, query, limit);
    }
  }

  /**
   * Get recent memories for a user
   */
  getRecent(userId: string, limit: number = 10): MemoryEntry[] {
    const userMemories = this.memories.get(userId);
    if (!userMemories) return [];
    return userMemories.slice(-limit).reverse();
  }

  /**
   * Get memories by type
   */
  getByType(
    userId: string,
    type: MemoryEntry["type"],
    limit: number = 20
  ): MemoryEntry[] {
    const userMemories = this.memories.get(userId);
    if (!userMemories) return [];
    return userMemories.filter((m) => m.type === type).slice(-limit).reverse();
  }

  /**
   * Delete a specific memory
   */
  delete(userId: string, memoryId: string): boolean {
    const userMemories = this.memories.get(userId);
    if (!userMemories) return false;

    const index = userMemories.findIndex((m) => m.id === memoryId);
    if (index === -1) return false;

    userMemories.splice(index, 1);
    this.embeddings.delete(memoryId);
    return true;
  }

  /**
   * Clear all memories for a user
   */
  clearUser(userId: string): void {
    this.memories.delete(userId);
    // Clean up embeddings for this user
    for (const [key] of this.embeddings) {
      const entry = this.findEntryById(key);
      if (entry?.userId === userId) {
        this.embeddings.delete(key);
      }
    }
  }

  /**
   * Get memory statistics for a user
   */
  getStats(userId: string): {
    total: number;
    byType: Record<string, number>;
  } {
    const userMemories = this.memories.get(userId) || [];
    const byType: Record<string, number> = {};

    for (const m of userMemories) {
      byType[m.type] = (byType[m.type] || 0) + 1;
    }

    return {
      total: userMemories.length,
      byType,
    };
  }

  // ── Private: Vector search ──

  private searchByVector(
    memories: MemoryEntry[],
    queryVector: number[],
    limit: number
  ): MemoryEntry[] {
    const scored = memories
      .map((entry) => {
        const embedding = this.embeddings.get(entry.id);
        if (!embedding) return { entry, score: 0 };

        const score = this.cosineSimilarity(queryVector, embedding);
        return { entry, score };
      })
      .sort((a, b) => b.score - a.score);

    return scored.slice(0, limit).map((s) => s.entry);
  }

  // ── Private: Keyword search fallback ──

  private searchByKeywords(
    memories: MemoryEntry[],
    query: string,
    limit: number
  ): MemoryEntry[] {
    const keywords = query
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 2);

    if (keywords.length === 0) {
      return memories.slice(-limit).reverse();
    }

    const scored = memories
      .map((entry) => {
        const content = entry.content.toLowerCase();
        const score = keywords.filter((k) => content.includes(k)).length;
        return { entry, score };
      })
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score);

    return scored.slice(0, limit).map((s) => s.entry);
  }

  // ── Private: Cosine similarity ──

  private cosineSimilarity(a: number[], b: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += (a[i] || 0) * (b[i] || 0);
      normA += (a[i] || 0) * (a[i] || 0);
      normB += (b[i] || 0) * (b[i] || 0);
    }

    const denominator = Math.sqrt(normA) * Math.sqrt(normB);
    return denominator === 0 ? 0 : dotProduct / denominator;
  }

  private findEntryById(id: string): MemoryEntry | undefined {
    for (const [, memories] of this.memories) {
      const found = memories.find((m) => m.id === id);
      if (found) return found;
    }
    return undefined;
  }
}
