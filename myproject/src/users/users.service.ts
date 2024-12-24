import { Injectable} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  //注册
  create(createUserDto: CreateUserDto) {
    //手动设置日期
    return this.prisma.user.create({ data:{...createUserDto,createdAt: new Date().toISOString()}});

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
