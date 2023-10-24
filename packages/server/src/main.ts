import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import { generateDocument } from "./doc";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  generateDocument(app);
 
  app.enableCors()
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(4396);
}
bootstrap();
