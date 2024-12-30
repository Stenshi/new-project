import { Injectable } from '@nestjs/common';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  // 获取所有分类及其子分类
  async getAllCategories() {
    return this.prisma.category.findMany({
      where: {
        parentId: null, // 只查询顶级分类
      },
      include: {
        children: true,  // 获取子分类
      },
    });
  }



  // 根据父分类 ID 查询分类
  async getCategoriesByParentId(parentId: number) {
    return this.prisma.category.findMany({
      where: {
        parentId: parentId,
      },
    });
  }

  // 添加新分类
  async createCategory(data) {
    return this.prisma.category.create({
      data,
    });
  }
}