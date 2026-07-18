import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateDocumentDto, UpdateDocumentDto } from "./dto/document.dto";

@Injectable()
export class VaultService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string, projectId?: string) {
    return this.prisma.document.findMany({
      where: {
        uploadedById: userId,
        ...(projectId ? { projectId } : {}),
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string, userId: string) {
    return this.prisma.document.findFirstOrThrow({
      where: { id, uploadedById: userId },
    });
  }

  async create(dto: CreateDocumentDto, userId: string) {
    return this.prisma.document.create({
      data: {
        filename: dto.filename,
        mimeType: dto.mimeType,
        sizeBytes: dto.sizeBytes,
        storageKey: dto.storageKey,
        checksum: dto.checksum,
        category: dto.category,
        projectId: dto.projectId,
        tags: dto.tags ?? [],
        uploadedById: userId,
      },
    });
  }

  async update(id: string, dto: UpdateDocumentDto, userId: string) {
    const existing = await this.prisma.document.findFirstOrThrow({
      where: { id, uploadedById: userId },
    });
    return this.prisma.document.update({
      where: { id: existing.id },
      data: {
        ...(dto.category !== undefined ? { category: dto.category } : {}),
        ...(dto.aiSummary !== undefined ? { aiSummary: dto.aiSummary } : {}),
        ...(dto.tags !== undefined ? { tags: dto.tags } : {}),
      },
    });
  }

  async remove(id: string, userId: string) {
    const existing = await this.prisma.document.findFirstOrThrow({
      where: { id, uploadedById: userId },
    });
    return this.prisma.document.delete({ where: { id: existing.id } });
  }
}
