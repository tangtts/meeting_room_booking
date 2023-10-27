import { generateDocument } from "./../doc";
import { ConfigService } from "@nestjs/config";
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Query,
  UnauthorizedException,
  HttpStatus,
  Req,
  Res,
  ParseIntPipe,
  BadRequestException,
  DefaultValuePipe,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { UpdateUserPasswordDto } from "./dto/update-user-password";
import { RegisterUserDto } from "./dto/register-user.dto";
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtService } from "@nestjs/jwt";
import { RequireLogin, UserInfo } from "src/custom.decorator";
import { UserDetailVo } from "./vo/user-info.vo";
import { UpdateUserDto } from "./dto/udpate-user.dto";
import * as svgCaptcha from "svg-captcha";
import { RedisService } from "src/redis/redis.service";
@ApiTags("user")
@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService
  ) {}

  @Get("generateCaptcha")
  generateCaptcha(@Res({ passthrough: true }) res) {
    const captcha = svgCaptcha.create({
      size: 4, //生成几个验证码
      fontSize: 50, //文字大小
      width: 100, //宽度
      height: 34, //高度
      background: "#cc9966", //背景颜色
    });
    res.set("Content-Type", "image/svg+xml");
    // 存放到 redis 中
    this.redisService.set(captcha.text, captcha.text, 60 * 5);
    return captcha.data;
  }

  @Get("getCaptcha")
  getCaptcha(@Query("s") s: string) {
    return this.userService.getCaptcha(s);
  }

  @ApiQuery({
    name: "refreshToken",
    type: String,
    description: "refreshToken",
    required: true,
    example:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTY5ODEzMDkxNiwiZXhwIjoxNjk4NzM1NzE2fQ.Bu4kU32nXyo_MQbNOqxeGtRb6TrIQ7g9TSnGe-gHrQY",
  })
  // 描述返回值
  @ApiResponse({
    status: HttpStatus.OK,
    description: "refreshToken",
  })
  @Get("refresh")
  async refresh(@Query("refreshToken") refreshToken: string) {
    return this.userService.getRefreshToken(refreshToken, false);
  }

  @Post(["update_password", "admin/update_password"])
  @RequireLogin()
  async updatePassword(
    @UserInfo("userId") userId: number,
    @Body() passwordDto: UpdateUserPasswordDto
  ) {
    return await this.userService.updatePassword(userId, passwordDto);
  }

  @Get("freeze")
  async freeze(@Query("id") userId: number) {
    await this.userService.freezeUserById(userId);
    return "success";
  }

  @Get("list")
  async list(
    @Query(
      "pageNo",
      new DefaultValuePipe(1),
      new ParseIntPipe({
        exceptionFactory() {
          throw new BadRequestException("pageNo 应该传数字");
        },
      })
    )
    pageNo: number,
    @Query(
      "pageSize",
      new DefaultValuePipe(2),
      new ParseIntPipe({
        exceptionFactory() {
          throw new BadRequestException("pageNo 应该传数字");
        },
      })
    )
    pageSize: number,
    @Query("username") username: string,
    @Query("nickName") nickName: string
  ) {
    return await this.userService.findUsersByPage({
      username,
      nickName,
      pageNo,
      pageSize,
    });
  }

  @Post(["update", "admin/update"])
  @RequireLogin()
  async update(
    @UserInfo("userId") userId: number,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return await this.userService.update(userId, updateUserDto);
  }

  @ApiBearerAuth()
  @Get("info")
  @RequireLogin()
  async info(@UserInfo("userId") userId: number) {
    const user = await this.userService.findUserDetailById(userId);
    const vo = new UserDetailVo();
    vo.id = user.id;
    vo.email = user.email;
    vo.username = user.username;
    vo.headPic = user.headPic;
    vo.phoneNumber = user.phoneNumber;
    vo.nickName = user.nickName;
    vo.createTime = user.createTime;
    vo.isFrozen = user.isFrozen;

    return vo;
  }

  @Get("admin/refresh")
  async adminRefresh(@Query("refreshToken") refreshToken: string) {
    return this.userService.getRefreshToken(refreshToken, true);
  }

  @Post("login")
  async login(@Body() loginUser: LoginUserDto) {
    const vo = await this.userService.login(loginUser, false);
    vo.accessToken = this.jwtService.sign(
      {
        userId: vo.userInfo.id,
        username: vo.userInfo.username,
        roles: vo.userInfo.roles,
        permissions: vo.userInfo.permissions,
      },
      {
        expiresIn:
          this.configService.get("jwt_access_token_expires_time") || "30m",
      }
    );

    vo.refreshToken = this.jwtService.sign(
      {
        userId: vo.userInfo.id,
      },
      {
        expiresIn:
          this.configService.get("jwt_refresh_token_expres_time") || "7d",
      }
    );
    return vo;
  }

  @Post("admin/login")
  adminLogin(@Body() user: LoginUserDto) {
    return this.userService.login(user, true);
  }

  @Post("register")
  register(@Body() user: RegisterUserDto) {
    return this.userService.register(user);
  }

  @Get("init-data")
  async initData() {
    await this.userService.initData();
    return "done";
  }
}
