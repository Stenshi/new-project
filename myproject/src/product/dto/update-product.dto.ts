import { PartialType } from '@nestjs/swagger';
import { CreateProDto } from './createProduct.dto';
//UpdateProductDto它继承了 CreateProDto 并通过 PartialType 转换所有字段为可选的。
//客户只需要提供他们要更新的字段，其他未提供的字段会保持不变。
export class UpdateProductDto extends PartialType(CreateProDto ) {}
