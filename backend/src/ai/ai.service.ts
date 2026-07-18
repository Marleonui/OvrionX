import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateMemoryDto } from "./dto/memory.dto";

@Injectable()
export class AiService {
  constructor(private readonly prisma: PrismaService) {}

  async getMemory(userId: string) {
    return this.prisma.aIMemoryEntry.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  }

  async addMemory(dto: CreateMemoryDto, userId: string) {
    return this.prisma.aIMemoryEntry.create({
      data: {
        userId,
        type: dto.type || "context",
        content: dto.content,
        source: dto.source || "manual",
        metadata: (dto.tags && dto.tags.length ? { tags: dto.tags } : {}) as any,
      },
    });
  }

  async clearMemory(userId: string) {
    return this.prisma.aIMemoryEntry.deleteMany({ where: { userId } });
  }

  // Lightweight analytics used by the BI / dashboard endpoints.
  async getStats(userId: string) {
    const [projects, tasks, docs, memory] = await Promise.all([
      this.prisma.project.count({ where: { ownerId: userId } }),
      this.prisma.task.count(),
      this.prisma.document.count({ where: { uploadedById: userId } }),
      this.prisma.aIMemoryEntry.count({ where: { userId } }),
    ]);

    const taskByStatus = await this.prisma.task.groupBy({
      by: ["status"],
      _count: { _all: true },
    });

    return {
      projects,
      tasks,
      documents: docs,
      memoryEntries: memory,
      taskByStatus: taskByStatus.reduce((acc, g) => {
        acc[g.status] = g._count._all;
        return acc;
      }, {} as Record<string, number>),
    };
  }
}
