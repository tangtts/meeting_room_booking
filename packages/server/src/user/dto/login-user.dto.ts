import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class LoginUserDto {
  @ApiProperty({
    default:"lisi"
  })
  @IsNotEmpty({
    message: "用户名不能为空",
  })
  username: string;

  @ApiProperty({
    default:"222222"
  })
  @IsNotEmpty({
    message: "密码不能为空",
  })
  password: string;
}
