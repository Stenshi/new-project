import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';


export const jwtSecret = 'zjP9h6ZI5LoSKCRj';
@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [PrismaModule,PassportModule,
    JwtModule.register({
      secret: jwtSecret,
      signOptions: { expiresIn: '5m' }, // e.g. 30s, 7d, 24h
    }),],
})
export class UsersModule {}
