import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { GetUser } from "../auth/decorators/get-user.decorator";
import { ProjectsService } from "./projects.service";
import { CreateProjectDto, UpdateProjectDto, CreateTaskDto, UpdateTaskDto } from "./dto/project.dto";

@ApiTags("Projects")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("projects")
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: "List projects for current user" })
  findAll(@GetUser("id") userId: string) {
    return this.projectsService.findAll(userId);
  }

  @Post()
  @ApiOperation({ summary: "Create a new project" })
  create(@Body() dto: CreateProjectDto, @GetUser("id") userId: string) {
    return this.projectsService.create(dto, userId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a single project with tasks" })
  findOne(@Param("id") id: string, @GetUser("id") userId: string) {
    return this.projectsService.findOne(id, userId);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update a project" })
  update(@Param("id") id: string, @Body() dto: UpdateProjectDto, @GetUser("id") userId: string) {
    return this.projectsService.update(id, dto, userId);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a project" })
  remove(@Param("id") id: string, @GetUser("id") userId: string) {
    return this.projectsService.remove(id, userId);
  }

  @Post(":id/tasks")
  @ApiOperation({ summary: "Create a task in a project" })
  createTask(
    @Param("id") projectId: string,
    @Body() dto: CreateTaskDto,
    @GetUser("id") userId: string
  ) {
    return this.projectsService.createTask(projectId, dto, userId);
  }

  @Put(":id/tasks/:taskId")
  @ApiOperation({ summary: "Update a task" })
  updateTask(
    @Param("id") projectId: string,
    @Param("taskId") taskId: string,
    @Body() dto: UpdateTaskDto,
    @GetUser("id") userId: string
  ) {
    return this.projectsService.updateTask(projectId, taskId, dto, userId);
  }

  @Delete(":id/tasks/:taskId")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a task" })
  removeTask(
    @Param("id") projectId: string,
    @Param("taskId") taskId: string,
    @GetUser("id") userId: string
  ) {
    return this.projectsService.removeTask(projectId, taskId, userId);
  }
}
