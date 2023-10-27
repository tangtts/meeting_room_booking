import { Global, Module } from "@nestjs/common";
import { RedisService } from "./redis.service";
import { createClient } from "redis";
import { ConfigService } from "@nestjs/config";


@Global()
@Module({
  exports:[RedisService],
  providers: [
    RedisService,
    {
      inject:[ConfigService],
      provide: "REDIS_CLIENT",
      async useFactory(configService:ConfigService) {
        const client = createClient({
          socket: {
            host: configService.get('redis_server_host'),
            port: configService.get('redis_server_port'),
          },
          database: configService.get('redis_server_db'),  // redis 的 database 就是一个命名空间的概念
        });
        await client.connect();
        return client;
      },
    },
  ],
})
export class RedisModule {}
