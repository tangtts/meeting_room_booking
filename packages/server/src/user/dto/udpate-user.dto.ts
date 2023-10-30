import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, isNotEmpty } from "class-validator";

export class UpdateUserDto {
  @IsNotEmpty({
    message:"用户id不存在"
  })
  id:number

  @IsOptional()
  headPic: string;

  @IsOptional()
  nickName: string;

  @IsOptional()
  @IsEmail(
    {},
    {
      message: "不是合法的邮箱格式",
    }
  )
  email: string;

  @IsOptional()
  username: string;

  @IsBoolean()
  isFrozen: boolean;

  @IsOptional()
  phoneNumber: string;
}
