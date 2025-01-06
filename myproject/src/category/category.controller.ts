import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';

import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // 获取所有顶级分类和子分类
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllCategories() {
    const categorylist = await this.categoryService.getAllCategories();
    return {
      data: categorylist,
    };
  }
  
  @Get('list')
  @UseGuards(JwtAuthGuard)
  async findAll() {
    const categorylist = await this.categoryService.findAll();
    return {
      data: categorylist,
    };
  }





  //根据分类名称查询
  @Get(':name')
  async getCategoriesByName(@Param('name') name: string) {
      const categorylist=await this.categoryService.getCategoriesByName(name);
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

  //更新分类
  
  @Patch(':id')
  update(@Param('id') id:string, @Body() updateCategoryDto: Prisma.CategoryCreateInput) {
    return this.categoryService.updateCategory(+id, updateCategoryDto)
  }

  
  //删除商品
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);}
}
