//描述JWT
import { ApiProperty } from '@nestjs/swagger';
export class AuthEntity  {
    @ApiProperty()
    accessToken: string;
}
