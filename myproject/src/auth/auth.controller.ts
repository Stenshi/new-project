
import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody,  ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthEntity } from './entities/auth.entity';
import { LoginDto } from './dto/login.dto';
import * as svgCaptcha from 'svg-captcha';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: '用户登录接口' }) // 描述接口功能
  @ApiBody({ type: LoginDto, description: '用户的登录信息' }) // 请求体的说明
  @ApiResponse({
    status: 201,
    type: AuthEntity, 
    description: '成功登录，返回用户信息或生成的 token',
  })
  @ApiResponse({ status: 404, description: '登录失败，用户名不存在' }) // 失败响应
  @ApiResponse({ status: 401, description: '登录失败，密码错误' }) // 失败响应
 
  login(@Body() { username, password }: LoginDto) {
    return this.authService.login(username, password);
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
  
}
