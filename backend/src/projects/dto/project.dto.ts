import { IsString, IsOptional, IsEnum, IsArray, IsDateString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { ProjectStatus } from "@prisma/client";

export class CreateProjectDto {
  @ApiProperty({ example: "Q4 Marketing Campaign" })
  @IsString()
  name: string;

  @ApiProperty({ required: false, example: "Launch campaign for new product line" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false, enum: ProjectStatus })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  teamIds?: string[];
}

export class UpdateProjectDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false, enum: ProjectStatus })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  teamIds?: string[];
}

export class CreateTaskDto {
  @ApiProperty({ example: "Design landing page" })
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false, enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"] })
  @IsOptional()
  @IsEnum(["LOW", "MEDIUM", "HIGH", "CRITICAL"])
  priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

  @ApiProperty({ required: false, enum: ["BACKLOG", "TODO", "IN_PROGRESS", "REVIEW", "DONE"] })
  @IsOptional()
  @IsEnum(["BACKLOG", "TODO", "IN_PROGRESS", "REVIEW", "DONE"])
  status?: "BACKLOG" | "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  assigneeId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  dueDate?: string;
}

export class UpdateTaskDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false, enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"] })
  @IsOptional()
  @IsEnum(["LOW", "MEDIUM", "HIGH", "CRITICAL"])
  priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

  @ApiProperty({ required: false, enum: ["BACKLOG", "TODO", "IN_PROGRESS", "REVIEW", "DONE"] })
  @IsOptional()
  @IsEnum(["BACKLOG", "TODO", "IN_PROGRESS", "REVIEW", "DONE"])
  status?: "BACKLOG" | "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  assigneeId?: string;
}
