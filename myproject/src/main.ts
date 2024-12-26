import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 启用全局验证管道
  app.useGlobalPipes(new ValidationPipe());

  //swagger配置
  const config = new DocumentBuilder()
  .setTitle('Median')
  .setDescription('The Median API description')
  .setVersion('0.1')
  .addBearerAuth()
  .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // 启用 CORS,解决跨域问题
  app.enableCors({
    origin: 'http://localhost:5173',  // 允许的域名访问，如果要指定多个具体域名，可以使用一个数组 ['http://example.com'，'...']
   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // 允许的 HTTP 方法
   allowedHeaders: ['Content-Type, Authorization','x-requested-with'],  // 允许的请求头
   credentials: true, // 允许携带认证信息，如 cookies
 });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
