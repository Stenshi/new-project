import { IsString, Min,  IsOptional, IsNumber, IsPositive, IsInt,  Length } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateProDto {
    @IsString()
    @Length(1, 10)
    @ApiProperty()
    name: string;  // 商品名称，必填，且长度至少为2个字符，最多为10个字符
  
    @IsString()
    @IsOptional()
    @Length(0,50)
    @ApiProperty()
    description?: string;  // 商品描述，选填，最多50个字符
  
    @IsNumber()
    @IsPositive()
    @ApiProperty()
    price: number;  // 商品价格，必填，且是正数
  
    @IsInt()
    @Min(0)
    @ApiProperty()
    stock: number;  // 商品库存量，必填，且不能为负数
    
    
    @IsOptional()
    @ApiProperty()
    imageUrl?: string;  // 商品图片URL，选填，
  
    @IsInt()
    @Min(1)
    @ApiProperty()
    userId: number;  // 用户ID，必填，假设它是外键关联到 User 表，且必须是正整数

    @IsInt()
    @IsOptional()
    @ApiProperty()
    categoryId?: number;  // 商品所属类目，选填


}
