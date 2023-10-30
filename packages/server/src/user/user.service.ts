import { Permission } from "./entities/permission.entity";
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { RegisterUserDto } from "./dto/register-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, Like, Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { RedisService } from "src/redis/redis.service";
import { md5 } from "src/utils";
import { Role } from "./entities/role.entity";
import { LoginUserDto } from "./dto/login-user.dto";
import { LoginUserVo } from "./vo/login-user.vo";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UpdateUserPasswordDto } from "./dto/update-user-password";
import { UpdateUserDto } from "./dto/udpate-user.dto";

@Injectable()
export class UserService {
  private logger = new Logger();

  @InjectRepository(User)
  private userRepository: Repository<User>;

  @InjectRepository(Role)
  private roleRepository: Repository<Role>;

  @InjectRepository(Permission)
  private permissionRepository: Repository<Permission>;

  constructor(
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {
  }



  async findUserDetailById(userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    return user;
  }

  async update( updateUserDto: UpdateUserDto) {
    // const captcha = await this.redisService.get(
    //   `update_user_captcha_${updateUserDto.email}`
    // );

    // const captcha = await this.redisService.get(updateUserDto.captcha);

    // if (!captcha) {
    //   throw new HttpException("验证码已失效", HttpStatus.BAD_REQUEST);
    // }

    // if (updateUserDto.captcha !== captcha) {
    //   throw new HttpException("验证码不正确", HttpStatus.BAD_REQUEST);
    // }

    const foundUser = await this.userRepository.findOneBy({
      id: updateUserDto.id,
    });

    if (updateUserDto.nickName) {
      foundUser.nickName = updateUserDto.nickName;
    }

    if (updateUserDto.isFrozen) {
      foundUser.isFrozen = updateUserDto.isFrozen;
    }

    if (updateUserDto.username) {
      foundUser.username = updateUserDto.username;
    }

    if (updateUserDto.headPic) {
      foundUser.headPic = updateUserDto.headPic;
    }

    if (updateUserDto.phoneNumber) {
      foundUser.phoneNumber = updateUserDto.phoneNumber;
    }

    if (updateUserDto.email) {
      foundUser.email = updateUserDto.email;
    }

    try {
      await this.userRepository.save(foundUser);
      return "用户信息修改成功";
    } catch (e) {
      this.logger.error(e, UserService);
      return "用户信息修改成功";
    }
  }

  async updatePassword(userId: number, passwordDto: UpdateUserPasswordDto) {
    // const captcha = await this.redisService.get(
    //   `update_password_captcha_${passwordDto.email}`
    // );

    const captcha = await this.redisService.get(passwordDto.captcha);

    if (!captcha) {
      throw new HttpException("验证码已失效", HttpStatus.BAD_REQUEST);
    }

    if (passwordDto.captcha !== captcha) {
      throw new HttpException("验证码不正确", HttpStatus.BAD_REQUEST);
    }

    const foundUser = await this.userRepository.findOneBy({
      id: userId,
    });

    foundUser.password = md5(passwordDto.password);

    try {
      await this.userRepository.save(foundUser);
      return "密码修改成功";
    } catch (e) {
      this.logger.error(e, UserService);
      return "密码修改失败";
    }
  }

  async getRefreshToken(refreshToken: string, isAdmin: boolean) {
    try {
      const data = this.jwtService.verify(refreshToken);

      const user = await this.findUserById(data.userId, isAdmin);
      //  再次加密
      const access_token = this.jwtService.sign(
        {
          userId: user.id,
          username: user.username,
          roles: user.roles,
          permissions: user.permissions,
        },
        {
          expiresIn:
            this.configService.get("jwt_access_token_expires_time") || "30m",
        }
      );

      const refresh_token = this.jwtService.sign(
        {
          userId: user.id,
        },
        {
          expiresIn:
            this.configService.get("jwt_refresh_token_expres_time") || "7d",
        }
      );
      return {
        access_token,
        refresh_token,
      };
    } catch {
      throw new UnauthorizedException("token已经失效");
    }
  }

  async findUserById(userId: number, isAdmin: boolean) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        isAdmin,
      },
      relations: ["roles", "roles.permissions"],
    });

    return {
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
      roles: user.roles.map(item => item.name),
      permissions: user.roles.reduce((arr, item) => {
        item.permissions.forEach(permission => {
          if (arr.indexOf(permission) === -1) {
            arr.push(permission);
          }
        });
        return arr;
      }, []),
    };
  }

  async initData() {
    const user1 = new User();
    user1.username = "zhangsan";
    user1.password = md5("111111");
    user1.email = "xxx@xx.com";
    user1.isAdmin = true;
    user1.nickName = "张三";
    user1.phoneNumber = "13233323333";

    const user2 = new User();
    user2.username = "lisi";
    user2.password = md5("222222");
    user2.email = "yy@yy.com";
    user2.nickName = "李四";

    const role1 = new Role();
    role1.name = "管理员";

    const role2 = new Role();
    role2.name = "普通用户";

    const permission1 = new Permission();
    permission1.code = "ccc";
    permission1.description = "访问 ccc 接口";

    const permission2 = new Permission();
    permission2.code = "ddd";
    permission2.description = "访问 ddd 接口";

    user1.roles = [role1];
    user2.roles = [role2];

    role1.permissions = [permission1, permission2];
    role2.permissions = [permission1];

    await this.permissionRepository.save([permission1, permission2]);
    await this.roleRepository.save([role1, role2]);
    await this.userRepository.save([user1, user2]);
  }

 async getCaptcha(captcha:string){
    return await this.redisService.get(captcha)
  }

  async register(user: RegisterUserDto) {
    const captcha = await this.redisService.get(user.captcha);

    if (!captcha) {
      throw new HttpException("验证码已失效", HttpStatus.BAD_REQUEST);
    }

    if (user.captcha !== captcha) {
      throw new HttpException("验证码不正确", HttpStatus.BAD_REQUEST);
    }

    const foundUser = await this.userRepository.findOneBy({
      username: user.username,
    });

    if (foundUser) {
      throw new HttpException("用户已存在", HttpStatus.BAD_REQUEST);
    }

    const role2 = new Role();
    role2.name = "普通用户";

    const permission1 = new Permission();
    permission1.code = "ccc";
    permission1.description = "访问 ccc 接口";

    role2.permissions = [permission1];

    const newUser = new User();
    newUser.username = user.username;
    newUser.password = md5(user.password);
    newUser.email = user.email;
    newUser.nickName = user.nickName;
    newUser.roles = [role2]
    this.userRepository.save(newUser);
    return user;
  }

  async login(loginUser: LoginUserDto, isAdmin: boolean) {
    if (!loginUser.username) {
      throw new HttpException("用户名不能为空", HttpStatus.BAD_REQUEST);
    }
    if (!loginUser.password) {
      throw new HttpException("密码不能为空", HttpStatus.BAD_REQUEST);
    }

    const user = await this.userRepository.findOne({
      where: {
        username: loginUser.username,
        isAdmin,
      },
      relations: ["roles", "roles.permissions"],
      // relations: {
      //   roles:true,
      // },
    });

    if (!user) {
      throw new HttpException("用户不存在", HttpStatus.BAD_REQUEST);
    }

    if (user.password !== md5(loginUser.password)) {
      throw new HttpException("密码错误", HttpStatus.BAD_REQUEST);
    }

    const vo = new LoginUserVo();
    vo.userInfo = {
      id: user.id,
      username: user.username,
      nickName: user.nickName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      headPic: user.headPic,
      createTime: user.createTime.getTime(),
      isFrozen: user.isFrozen,
      isAdmin: user.isAdmin,
      roles: user.roles.map(item => item.name),
      permissions: user.roles.reduce((arr, item) => {
        item.permissions.forEach(permission => {
          if (arr.indexOf(permission) === -1) {
            arr.push(permission);
          }
        });
        return arr;
      }, []),
    };

    return vo;
  }

  async toggleFreezeUserById(id: number) {
    const user = await this.userRepository.findOneBy({
      id,
    });

    user.isFrozen = !user.isFrozen;

    await this.userRepository.save(user);
  }
  async findUsersByPage({
    username,
    nickName,
    pageNo,
    pageSize,
    startTime,
    endTime
  }: {
    username: string;
    nickName: string;
    pageNo: number;
    pageSize: number;
    startTime: string;
    endTime: string;
  }) {
    console.log("🚀 ~ file: user.service.ts:337 ~ UserService ~ startTime:", startTime);
    const skipCount = (pageNo - 1) * pageSize;

    const condition: Record<string, any> = {};

    if (username) {
      condition.username = Like(`%${username}%`);
    }
    if (nickName) {
      condition.nickName = Like(`%${nickName}%`);
    }

    let startDate  = new Date('1900/1/1')
    if(startTime){
      startDate = new Date(startTime);
    }

    let endDate  = new Date('2099/1/1')
    if(endTime){
      endDate = new Date(endTime);
    }
    condition.createTime = Between(startDate, endDate);

    const [users, totalCount] = await this.userRepository.findAndCount({
      select: [
        "id",
        "username",
        "nickName",
        "email",
        "phoneNumber",
        "isFrozen",
        "headPic",
        "createTime",
      ],
      skip: skipCount,
      take: pageSize,
      where: condition,
    });

    return {
      users,
      totalCount,
    };
  }
}
