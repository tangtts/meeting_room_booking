import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { RedisService } from "src/redis/redis.service";
import { RedisModule } from "src/redis/redis.module";
import { Role } from "./entities/role.entity";
import { Permission } from "./entities/permission.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User,Permission,Role])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
