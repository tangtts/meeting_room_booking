import { Controller, Get, SetMetadata } from "@nestjs/common";
import { AppService } from "./app.service";
import {RequireLogin} from "./custom.decorator"
@Controller()
export default class AppController {
  constructor(private appService: AppService) {}

  @Get("aaa")
  // @SetMetadata('require-login', true)
  @RequireLogin()
  aaa() {
    return "aaa";
  }

  @Get("bbb")
  bbb() {
    return "bbb";
  }
}
