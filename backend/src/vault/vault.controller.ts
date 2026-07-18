import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { GetUser } from "../auth/decorators/get-user.decorator";
import { VaultService } from "./vault.service";
import { CreateDocumentDto, UpdateDocumentDto } from "./dto/document.dto";

@ApiTags("Data Vault")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("vault")
export class VaultController {
  constructor(private readonly vaultService: VaultService) {}

  @Get()
  @ApiOperation({ summary: "List documents in the vault" })
  findAll(@GetUser("id") userId: string, @Query("projectId") projectId?: string) {
    return this.vaultService.findAll(userId, projectId);
  }

  @Post()
  @ApiOperation({ summary: "Register a new document" })
  create(@Body() dto: CreateDocumentDto, @GetUser("id") userId: string) {
    return this.vaultService.create(dto, userId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a single document" })
  findOne(@Param("id") id: string, @GetUser("id") userId: string) {
    return this.vaultService.findOne(id, userId);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update document metadata" })
  update(@Param("id") id: string, @Body() dto: UpdateDocumentDto, @GetUser("id") userId: string) {
    return this.vaultService.update(id, dto, userId);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a document" })
  remove(@Param("id") id: string, @GetUser("id") userId: string) {
    return this.vaultService.remove(id, userId);
  }
}
