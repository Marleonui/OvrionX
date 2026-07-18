import { IsString, IsOptional, IsArray } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateMemoryDto {
  @ApiProperty({ example: "context", enum: ["context", "preference", "fact", "instruction"] })
  @IsString()
  type: string;

  @ApiProperty({ example: "User prefers concise summaries." })
  @IsString()
  content: string;

  @ApiProperty({ required: false, example: "manual" })
  @IsOptional()
  @IsString()
  source?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  tags?: string[];
}
