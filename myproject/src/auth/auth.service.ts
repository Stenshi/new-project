//src/auth/auth.service.ts
import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
  } from '@nestjs/common';
  import { PrismaService } from './../prisma/prisma.service';
  import { JwtService } from '@nestjs/jwt';
  import { AuthEntity } from './entities/auth.entity';
   
  
  @Injectable()
  export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) {}
  
    async login(username: string, password: string): Promise< AuthEntity> {
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
  }