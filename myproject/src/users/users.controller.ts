import { Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Authlogin } from './entities/user.entity';
@Controller('users')
@ApiTags('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  //注册
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  //登录
  @Post('login')
  //这是一个 Swagger 注解，用于生成 API 文档。
  @ApiOkResponse({ type: Authlogin })
  login(@Body() { username, password }: LoginDto) {
    return this.usersService.login(username, password);
  }
   
  
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
