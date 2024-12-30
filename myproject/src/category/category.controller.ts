import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CategoryService } from './category.service';

import { Prisma } from '@prisma/client';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // 获取所有顶级分类和子分类
  @Get()
  async getAllCategories() {
    const categorylist = await this.categoryService.getAllCategories();
    return {
      data: categorylist,
    };
  }

  // 获取某个父分类下的所有子分类
  @Get(':parentId')
  getCategoriesByParentId(@Param('parentId') parentId: number) {
    return this.categoryService.getCategoriesByParentId(parentId);
  }

  // 添加分类
  //Prisma.CategoryCreateInput一个自动生成的类型，用于描述在数据库中创建 Category（分类）记录时所需要的字段结构
  @Post()
  createCategory(@Body() createCategoryDto: Prisma.CategoryCreateInput) {
    return this.categoryService.createCategory(createCategoryDto);
  }
}
