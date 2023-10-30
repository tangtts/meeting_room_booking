import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import { generateDocument } from "./doc";
import { ConfigService } from "@nestjs/config";
import { FormatResponseInterceptor } from "./format-response.interceptor";
import { InvalidatedProjectKind } from "typescript";
import { InvokeRecordInterceptor } from "./invoke-record.interceptor";
import { UnLoginException, UnloginFilter } from "./unlogin.filter";
import { CustomExceptionFilter } from "./custom-exception.filter";
import { join, resolve } from "path";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  generateDocument(app);
 
  app.enableCors()
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new FormatResponseInterceptor());
  app.useGlobalInterceptors(new InvokeRecordInterceptor());
  app.useGlobalFilters(new UnloginFilter(),new CustomExceptionFilter())
  const configService =  app.get(ConfigService)
  app.useStaticAssets(join(__dirname,'..','..','my-uploads'),{prefix:'/static'})
  await app.listen(configService.get('nest_server_port'));
}
bootstrap();
