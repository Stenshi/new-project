import { Injectable } from '@nestjs/common';

import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProDto } from './dto/createProduct.dto';





@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}
  //增加商品
  create(createProjectDto: CreateProDto  ) {
    return this.prisma.product.create({data:createProjectDto})
  }

  //查询所有商品
  findAll() {
    return  this.prisma.product.findMany();;
  }
  
  //模糊查询商品
  findMany(name: string) {
   
    return this.prisma.product.findMany({
      where: { name: {
        contains: name,  // Prisma 的 contains 用于做模糊查询
        mode: 'insensitive',  // 可选: 忽略大小写
      },},  // 模糊匹配 name 字段 },  // 按name查找
    });
  }
  //查询单个商品
  findOneByName(name: string){
    return this.prisma.product.findUnique({
      where: {
        name: name, // 查找一个商品名为 `name` 的商品
      },
    });
  }
  //更新商品
  update(id: number, updateProductDto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },  // 查找要更新的商品，条件是 id
      data: updateProductDto,  // 更新数据，使用 UpdateProductDto 中的数据
    });
  }
  
  // 删除商品
  remove(id: number) {
    return this.prisma.product.delete({
      where: { id },  // 根据 id 删除商品
    });
  }
}
