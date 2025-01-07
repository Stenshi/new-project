
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Length} from 'class-validator';

export class CreateCategoryDto {
  
    @IsString()
    @Length(1, 10)
    @ApiProperty()
    name: string;  // 分类名称，必填，且长度至少为2个字符，最多为10个字符
  
    @IsString()
    @IsOptional()
    @Length(0,50)
    @ApiProperty()
    description?: string;  // 商品分类描述，选填，最多50个字符

    
    @ApiProperty({ description: '父分类ID' , nullable: true, type: Number      })
    @Transform(({ value }) => (value === null || value === 'null' ? null : value)) // 处理 null 或 'null' 字符串转换为 null
    parentId: number | null;
  
   

}