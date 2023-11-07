import { OmitType, PartialType } from "@nestjs/swagger";
import { UpdateUserDto } from "./udpate-user.dto";
import { IsNotEmpty, IsString } from "class-validator";


export class UpdateSelfUserDto extends OmitType(UpdateUserDto,['id',"isFrozen"]){
  @IsString()
  @IsNotEmpty({
    message:"验证码不存在"
  })
  captcha:string
} 