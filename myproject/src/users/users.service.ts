import { HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';  
import { RegisterDto } from './dto/register.dto';
export const roundsOfHashing = 10;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  //注册
  async create(createUserDto: RegisterDto) {
    const user = await this.finduser(createUserDto.username)
    const email = await this.findemail(createUserDto.email)
    if(user){
      throw new HttpException(
        { message: '用户名已经存在' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }else if(email){
      throw new HttpException(
        { message: '邮箱已经被注册' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
   
    //将密码转为哈希
      const hashedPassword = await bcrypt.hash(
        createUserDto.password,
        //加密十轮
        roundsOfHashing,
      )
      createUserDto.password = hashedPassword;
    
    return this.prisma.user.create({ data:createUserDto});

  }
  //通过用户名查询用户
  finduser(username:string) {
    return this.prisma.user.findUnique({ where: { username:username } })
  }

  //通过email查询用户
  findemail(email:string) {
    return this.prisma.user.findUnique({ where: { email:email } })
  }
  
  //验证用户名和密码
  validUser(username: string, password: string){
    return this.prisma.user.findFirst({
      where: {
        username: username,
        password: password,  // 假设你已经用加密前的明文密码
      }})
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
