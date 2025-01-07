import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}
  //获取分类列表
  findAll() {
    return  this.prisma.category.findMany();;
  }


  // 获取所有分类及其子分类
  async getAllCategories() {
    // 递归函数，获取分类及其所有子分类
    const getCategoriesWithChildren = async (parentId = null) => {
      // 查询当前父分类下的所有子分类
      const categories = await this.prisma.category.findMany({
        where: { parentId },
        include: {
          children: true, // 获取当前分类的直接子分类
        },
      });

      // 递归处理每个分类的子分类
      for (const category of categories) {
        if (category.children && category.children.length > 0) {
          // 如果当前分类有子分类，递归获取每个子分类的子分类
          category.children = await getCategoriesWithChildren(category.id);
        }
      }

      return categories;
    };
    // 获取顶级分类及其所有层级的子分类
    return getCategoriesWithChildren();
  }

  //根据分类名称查询

  async getCategoriesByName(name: string) {
    const res = await this.prisma.category.findMany({
      where: {
        name: name,
      },
    });
  
    // 如果没有找到对应的分类，返回一个空数组
    if (!res || res.length === 0) {
      return [];
    }
  
    const id = res[0].id;
  
    // 递归函数，获取分类及其所有子分类
    const getCategoriesWithChildren = async (parentId: number) => {
      // 查询当前父分类下的所有子分类
      const categories = await this.prisma.category.findMany({
        where: { parentId },
        include: {
          children: true, // 获取当前分类的直接子分类
        },
      });
  
      // 递归处理每个分类的子分类
      for (const category of categories) {
        if (category.children && category.children.length > 0) {
          // 如果当前分类有子分类，递归获取每个子分类的子分类
          category.children = await getCategoriesWithChildren(category.id);
        }
      }
  
      // 返回包含当前分类及其子分类的数组
      return categories.map((category) => ({
        ...category,
        children: category.children || [],
      }));
    };
  
    // 获取符合条件的分类及其所有子分类
    const categoriesWithChildren = await getCategoriesWithChildren(id);
  
    // 将父分类添加到结果中
    return [
      {
        id: res[0].id,
        name: res[0].name,
        children: categoriesWithChildren,
      },
    ];
  }

  // 根据父分类 ID 查询分类
  async getCategoriesByParentId(parentId: number) {
    return this.prisma.category.findMany({
      where: {
        parentId: parentId,
      },
    });
  }

  // category.service.ts
async findByName(name: string) {
  return this.prisma.category.findUnique({ where: { name } });
}
  

  // 添加新分类
  //Prisma.CategoryCreateInput一个自动生成的类型，用于描述在数据库中创建 Category（分类）记录时所需要的字段结构
  async createCategory(data: CreateCategoryDto) {
    return this.prisma.category.create({
      data,
    });
  }

  //更新分类
  updateCategory(id:number, data: UpdateCategoryDto ) {
    return this.prisma.category.update({
      where: { id },  // 查找要更新的商品分类，条件是 id
      data: data,  // 更新的数据
    });
  }

  // 删除商品分类
  
  async remove(id: number) {
    
      // 使用 Prisma 事务来保证操作的一致性
      const deletedCategory = await this.prisma.$transaction(async (prisma) => {
        // Step 1: 查找所有子分类
        const childCategories = await prisma.category.findMany({
          where: { parentId: id },
        });
  
        // 如果存在子分类，则不能删除
        if (childCategories.length > 0) {
          return { success: 'false', message: `删除失败，存在子分类，无法删除` };
        }
  
        // Step 2: 检查是否有商品绑定到该分类
        const products = await prisma.product.findMany({
          where: { categoryId: id },
        });
  
        // 如果有商品绑定，则不能删除
        if (products.length > 0) {
          return { success: "false1", message: `删除失败，存在商品与该分类关联` };
        }
  
        // Step 3: 删除目标分类
        await prisma.category.delete({
          where: { id },
        });
  
        // 返回删除成功的结果
        return { success: 'true', message: `分类删除成功` };
      });
  
      return deletedCategory;
    }
}

