
import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthEntity } from './entities/auth.entity';
import { LoginDto } from './dto/login.dto';
import * as svgCaptcha from 'svg-captcha';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ type: AuthEntity })
  login(@Body() { username, password }: LoginDto) {
    return this.authService.login(username, password);
  }

  @Get('code')
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
