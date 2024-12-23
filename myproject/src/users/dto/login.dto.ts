
import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @ApiProperty()
  password: string;
}