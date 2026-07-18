import { IsEmail, IsString, MinLength, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {
  @ApiProperty({ example: "user@orionx.com", description: "Email address" })
  @IsEmail({}, { message: "Invalid email address" })
  email: string;

  @ApiProperty({ example: "SecurePass123!", description: "Password" })
  @IsString()
  @MinLength(8, { message: "Password must be at least 8 characters" })
  @MaxLength(128, { message: "Password must not exceed 128 characters" })
  password: string;

  @ApiProperty({ example: "Max Mustermann", description: "Display name" })
  @IsString()
  @MinLength(2, { message: "Display name must be at least 2 characters" })
  @MaxLength(100, { message: "Display name must not exceed 100 characters" })
  displayName: string;
}
