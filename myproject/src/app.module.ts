import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';



@Module({
  imports: [PrismaModule, UsersModule, AuthModule, ProductModule, CategoryModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
