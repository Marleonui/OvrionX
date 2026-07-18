import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateProjectDto, UpdateProjectDto, CreateTaskDto, UpdateTaskDto } from "./dto/project.dto";
import { ProjectStatus, TaskStatus } from "@prisma/client";

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    const projects = await this.prisma.project.findMany({
      where: { ownerId: userId },
      include: { _count: { select: { tasks: true } } },
      orderBy: { createdAt: "desc" },
    });
    const teamProjects = await this.prisma.project.findMany({
      where: { ownerId: { not: userId } },
      include: { _count: { select: { tasks: true } } },
    });
    const memberOf = teamProjects.filter((p) => {
      try {
        const ids = typeof p.teamIds === "string" ? JSON.parse(p.teamIds) : p.teamIds;
        return Array.isArray(ids) && ids.includes(userId);
      } catch {
        return false;
      }
    });
    return [...projects, ...memberOf];
  }

  async findOne(id: string, userId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: { tasks: { orderBy: { order: "asc" } }, _count: { select: { tasks: true } } },
    });

    if (!project) throw new NotFoundException("Project not found");
    const isMember = project.ownerId === userId || this.isTeamMember(project.teamIds, userId);
    if (!isMember) throw new NotFoundException("Project not found or access denied");
    return project;
  }

  private isTeamMember(teamIds: any, userId: string): boolean {
    try {
      const ids = typeof teamIds === "string" ? JSON.parse(teamIds) : teamIds;
      return Array.isArray(ids) && ids.includes(userId);
    } catch {
      return false;
    }
  }

  async create(dto: CreateProjectDto, userId: string) {
    const teamIds = Array.isArray(dto.teamIds) ? dto.teamIds : [];
    return this.prisma.project.create({
      data: {
        name: dto.name,
        description: dto.description,
        status: dto.status || ProjectStatus.ACTIVE,
        ownerId: userId,
        teamIds: JSON.stringify(Array.from(new Set([userId, ...teamIds]))),
      },
      include: { _count: { select: { tasks: true } } },
    });
  }

  async update(id: string, dto: UpdateProjectDto, userId: string) {
    await this.ensureOwner(id, userId);
    const data: any = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.status !== undefined) data.status = dto.status;
    if (dto.teamIds !== undefined) data.teamIds = JSON.stringify(dto.teamIds);

    return this.prisma.project.update({ where: { id }, data });
  }

  async remove(id: string, userId: string) {
    await this.ensureOwner(id, userId);
    return this.prisma.project.delete({ where: { id } });
  }

  // ── Tasks ──

  async createTask(projectId: string, dto: CreateTaskDto, userId: string) {
    await this.ensureMember(projectId, userId);
    const count = await this.prisma.task.count({ where: { projectId } });
    return this.prisma.task.create({
      data: {
        projectId,
        title: dto.title,
        description: dto.description,
        priority: dto.priority || "MEDIUM",
        status: dto.status || "TODO",
        assigneeId: dto.assigneeId,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        order: count,
      },
    });
  }

  async updateTask(projectId: string, taskId: string, dto: UpdateTaskDto, userId: string) {
    await this.ensureMember(projectId, userId);
    const data: any = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.priority !== undefined) data.priority = dto.priority;
    if (dto.status !== undefined) data.status = dto.status;
    if (dto.assigneeId !== undefined) data.assigneeId = dto.assigneeId;

    return this.prisma.task.update({ where: { id: taskId }, data });
  }

  async removeTask(projectId: string, taskId: string, userId: string) {
    await this.ensureMember(projectId, userId);
    return this.prisma.task.delete({ where: { id: taskId } });
  }

  private async ensureOwner(id: string, userId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id, ownerId: userId },
    });
    if (!project) throw new ForbiddenException("Only the project owner can perform this action");
  }

  private async ensureMember(id: string, userId: string) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project || (project.ownerId !== userId && !this.isTeamMember(project.teamIds, userId))) {
      throw new NotFoundException("Project not found or access denied");
    }
  }
}
