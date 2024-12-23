//描述JWT
import { ApiProperty } from '@nestjs/swagger';
export class Authlogin {
    @ApiProperty()
    accessToken: string;
}
