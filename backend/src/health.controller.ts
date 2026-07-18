import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";

@ApiTags("Health")
@Controller("health")
export class HealthController {
  @Get()
  @ApiOperation({ summary: "Check API health status" })
  check() {
    return {
      status: "ok",
      service: "ORION X API",
      version: "0.1.0",
      timestamp: new Date().toISOString(),
    };
  }
}
