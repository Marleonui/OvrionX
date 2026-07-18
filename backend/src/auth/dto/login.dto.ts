import { IsEmail, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({ example: "user@orionx.com", description: "Email address" })
  @IsEmail({}, { message: "Invalid email address" })
  email!: string;

  @ApiProperty({ example: "SecurePass123!", description: "Password" })
  @IsString()
  password!: string;
}
