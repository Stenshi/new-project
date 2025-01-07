import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards, ParseIntPipe, HttpCode, Req, Res} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';
import * as svgCaptcha from 'svg-captcha';
@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  //注册
  @Post('register')
  @ApiOperation({ summary: '注册新用户' })
  @ApiResponse({
    status: 201,
    description: '用户成功注册',
  })
  @ApiResponse({
    status: 400,
    description: '请求数据不合法',
  })
  @HttpCode(201) // 设置返回的状态码为 201
  create(@Body() createUserDto:RegisterDto ) {
    return this.usersService.create(createUserDto);
  }
 
  @Get('code')
  @ApiOperation({ summary: '生成验证码' }) // 接口说明
  @ApiOkResponse({
    description: '返回验证码的图像数据和文本',
    schema: {
      type: 'object',
      properties: {
        image: { type: 'string', description: '验证码图像的 SVG 字符串' },
        text: { type: 'string', description: '验证码文本' },
      },
    },
  }) // 返回响应

  createCaptcha(@Req() req, @Res() res) {
    // 假设使用 svg-captcha 库生成验证码
    const captcha = svgCaptcha.create({
       size: 4, width: 100, height: 34,background: '#cc9966', 
      });
     

       // 返回包含图像数据和验证码文本的 JSON 对象
    res.json({
      image: captcha.data, // 图像数据（SVG 字符串）
      text: captcha.text,  // 验证码文本
    });
  }
  

  // 获取单个用户
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id)
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
