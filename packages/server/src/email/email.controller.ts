import { ConfigService } from "@nestjs/config";
import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { EmailService } from "./email.service";
import { RedisService } from "src/redis/redis.service";

@Controller("email")
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private readonly redisService: RedisService
  ) {}
  @Post("code")
  async sendEmailCode(@Body("address") address) {
    const code = Math.random().toString().slice(2, 8);
    await this.redisService.set(`captcha_${address}`, code, 300);
    await this.emailService.sendMail({
      to: address,
      subject: "登录验证码",
      html: `<p>你的验证码是 ${code}</p>`,
    });
    return "发送成功";
  }
}
