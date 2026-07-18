import { IsString, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateDocumentDto {
  @ApiProperty({ example: "Q3 Report.pdf" })
  @IsString()
  filename: string;

  @ApiProperty({ example: "application/pdf" })
  @IsString()
  mimeType: string;

  @ApiProperty({ example: 1048576 })
  sizeBytes: number;

  @ApiProperty({ example: "documents/abc123" })
  @IsString()
  storageKey: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  checksum?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  projectId?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  tags?: string[];
}

export class UpdateDocumentDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  aiSummary?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  tags?: string[];
}
