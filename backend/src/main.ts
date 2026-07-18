import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import * as helmet from "helmet";
import * as compression from "compression";
import * as cookieParser from "cookie-parser";
import { AppModule } from "./app.module";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const h = (helmet as any).default || helmet;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const c = (compression as any).default || compression;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cp = (cookieParser as any).default || cookieParser;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security
  app.use(h());
  app.use(c());
  app.use(cp());

  app.enableCors({
    origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-API-Key"],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  // API prefix
  app.setGlobalPrefix("api", {
    exclude: ["health"],
  });

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle("ORION X API")
    .setDescription("ORION X — Intelligent Enterprise Operating System API")
    .setVersion("1.0")
    .addBearerAuth()
    .addApiKey({ type: "apiKey", name: "X-API-Key", in: "header" }, "api-key")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`\n🚀 ORION X API is running on http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
