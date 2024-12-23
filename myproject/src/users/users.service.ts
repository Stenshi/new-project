import { Injectable,NotFoundException,UnauthorizedException, } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Authlogin } from './entities/user.entity';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}
  //注册
  create(createUserDto: CreateUserDto) {
    //手动设置日期
    return this.prisma.user.create({ data:{...createUserDto,createdAt: new Date().toISOString()}});
  }
  //登录
  async login(username: string, password: string): Promise<Authlogin> {
    //根据用户名查询
    const user = await this.prisma.user.findUnique({ where: { username: username } });
    //如果用户名不存在
    if (!user) {
      throw new NotFoundException(`用户名不存在，请注册或重新输入`);
    }

    // 判断密码是否相等
    const isPasswordValid = user.password === password;

    // 如果密码错误
    if (!isPasswordValid) {
      throw new UnauthorizedException('密码错误，请重新输入');
    }
    
    // 若登录成功，生成 JWT 并返回
    return {
      accessToken: this.jwtService.sign({ userId: user.id }),
    };
  }


  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
