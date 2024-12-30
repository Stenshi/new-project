import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  controllers: [ProductController],
  providers: [ProductService,PrismaService],
  imports: [PrismaModule,
     // 配置 ServeStaticModule,公开文件夹，让浏览器可以访问。
     ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'uploads'), // 指定公开的文件夹路径
      serveRoot: '/uploads', // 通过 /uploads 路径访问静态文件
    }),
  ],
})
export class ProductModule {}
