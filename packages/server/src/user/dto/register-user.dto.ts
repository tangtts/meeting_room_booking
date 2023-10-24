import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class RegisterUserDto {
  @ApiProperty({
    default:"zs",
    type: String,
    description: "用户名",
  })
  @IsNotEmpty({
    message: "用户名不能为空",
  })
  username: string;

  @ApiProperty({
    default:"zs2",
    type: String,
    description: "昵称",
  })
  @IsNotEmpty({
    message: "昵称不能为空",
  })
  nickName: string;

  @ApiProperty({
    default:"123456",
    type: String,
    description: "密码",
  })
  @IsNotEmpty({
    message: "密码不能为空",
  })
  @MinLength(6, {
    message: "密码不能少于 6 位",
  })
  password: string;

  @ApiProperty({
    default:"xx@xx.com",
    type: String,
    description: "邮箱",
  })
  @IsNotEmpty({
    message: "邮箱不能为空",
  })
  @IsEmail(
    {},
    {
      message: "不是合法的邮箱格式",
    }
  )
  email: string;

  @ApiProperty({
    default:"abc123",
    type: String,
    description: "验证码",
  })
  @IsNotEmpty({
    message: "验证码不能为空",
  })
  captcha: string;
}
