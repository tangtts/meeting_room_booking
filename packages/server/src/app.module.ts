import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { DataSourceOptions } from "typeorm";
import { AppService } from "./app.service";
import AppController from "./app.controller";
import { User } from "./user/entities/user.entity";
import { Role } from "./user/entities/role.entity";
import { Permission } from "./user/entities/permission.entity";
import { UserModule } from "./user/user.module";
import { RedisModule } from "./redis/redis.module";
import { JwtModule } from "@nestjs/jwt";
import { LoginGuard } from "./login.guard";
import { APP_GUARD } from "@nestjs/core";
import { PermissionGuard } from "./permission.guard";
import { EmailModule } from './email/email.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    EmailModule,
    UserModule,
    RedisModule,
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get<string>("jwt_secret"),
          signOptions: {
            expiresIn: configService.get<string>(
              "jwt_access_token_expires_time"
            ),
          },
        };
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return {
          type: "mysql",
          host: configService.get("mysql_server_host"),
          port: configService.get("mysql_server_port"),
          username: configService.get("mysql_server_username"),
          password: configService.get("mysql_server_password"),
          database: configService.get("mysql_server_database"),
          synchronize: true,
          logging: true,
          entities: [User, Role, Permission],
          poolSize: 10,
          connectorPackage: "mysql2",
          extra: {
            authPlugin: "sha256_password",
          },
        };
      },
    }),
    UploadModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD, // 字符串 APP_GUARD
      useClass: LoginGuard,
    },
    {
      provide: APP_GUARD, // 字符串 APP_GUARD
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule {}
