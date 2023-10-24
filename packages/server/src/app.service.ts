import { InjectRepository } from "@nestjs/typeorm";
import { Get, Injectable } from "@nestjs/common";

@Injectable()
export class AppService {

  constructor() {}

   getHello(): string {
    return "getHello";
  }

}
