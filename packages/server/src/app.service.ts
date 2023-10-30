import { InjectRepository } from "@nestjs/typeorm";
import { Get, Injectable } from "@nestjs/common";
import { createTransport, Transporter } from "nodemailer";
@Injectable()
export class AppService {

  getHello(): string {
    return "getHello";
  }
 
}
