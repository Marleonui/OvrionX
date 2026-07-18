import { Controller, Get, Post, Delete, Body, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { GetUser } from "../auth/decorators/get-user.decorator";
import { AiService } from "./ai.service";
import { CreateMemoryDto } from "./dto/memory.dto";

@ApiTags("AI Assistant")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("ai")
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get("memory")
  @ApiOperation({ summary: "Get AI memory entries for the user" })
  getMemory(@GetUser("id") userId: string) {
    return this.aiService.getMemory(userId);
  }

  @Post("memory")
  @ApiOperation({ summary: "Add an AI memory entry" })
  addMemory(@Body() dto: CreateMemoryDto, @GetUser("id") userId: string) {
    return this.aiService.addMemory(dto, userId);
  }

  @Delete("memory")
  @ApiOperation({ summary: "Clear all AI memory entries" })
  clearMemory(@GetUser("id") userId: string) {
    return this.aiService.clearMemory(userId);
  }

  @Get("stats")
  @ApiOperation({ summary: "Aggregated stats for dashboard / BI" })
  getStats(@GetUser("id") userId: string) {
    return this.aiService.getStats(userId);
  }
}
