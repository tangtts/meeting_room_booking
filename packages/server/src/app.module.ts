import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { DataSourceOptions } from "typeorm";
import { AppService } from "./app.service";
import AppController from "./app.controller";
import { User } from "./user/entities/user.entity";
import { Role } from "./user/entities/role.entity";
import { Permission } from "./user/entities/permission.entity";
import { UserModule } from "./user/user.module";
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    UserModule,
    RedisModule,
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "123456",
      database: "meeting_room_booking_system",
      synchronize: true,
      logging: true,
      entities: [User, Role, Permission],
      poolSize: 10,
      connectorPackage: "mysql2",
      extra: {
        authPlugin: "sha256_password",
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
