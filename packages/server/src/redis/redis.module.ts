import { Global, Module } from "@nestjs/common";
import { RedisService } from "./redis.service";
import { createClient } from "redis";


@Global()
@Module({
  exports:[RedisService],
  providers: [
    RedisService,
    {
      provide: "REDIS_CLIENT",
      async useFactory() {
        const client = createClient({
          socket: {
            host: "localhost",
            port: 6379,
          },
          database: 1,  // redis 的 database 就是一个命名空间的概念
        });
        await client.connect();
        return client;
      },
    },
  ],
})
export class RedisModule {}
