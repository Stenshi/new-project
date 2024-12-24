import { Injectable} from '@nestjs/common';

import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';  
import { RegisterDto } from './dto/register.dto';
export const roundsOfHashing = 10;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  //注册
  async create(createUserDto: RegisterDto) {
    //将密码转为哈希
      const hashedPassword = await bcrypt.hash(
        createUserDto.password,
        //加密十轮
        roundsOfHashing,
      )
      createUserDto.password = hashedPassword;
    
    return this.prisma.user.create({ data:createUserDto});

  }
 
  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id: id } })
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
