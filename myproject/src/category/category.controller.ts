import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Query } from '@nestjs/common';
import { CategoryService } from './category.service';


import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiBearerAuth() // 需要Bearer认证
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // 获取所有顶级分类和子分类
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取所有顶级分类和子分类' }) // 接口的简要描述
  @ApiResponse({ status: 200, description: '成功获取分类数据' })
  
  async getAllCategories() {
    const categorylist = await this.categoryService.getAllCategories();
    return {
      data: categorylist,
    };
  }


  
  // 获取所有的分类
  @Get('list')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取所有分类' })
  @ApiResponse({ status: 200, description: '成功获取分类列表'})
  async findAll() {
    const categorylist = await this.categoryService.findAll();
    return {
      data: categorylist,
    };
  }

  

  @Get('findByName')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '根据分类名称获取单个分类' })
  
  async findByName(@Query('name') name: string) {
    // 调用categoryService的方法，根据名称查询单个分类
    const category = await this.categoryService.findByName(name);
  
    let message = '';

    if (category) {
      message = '商品名存在';
    }
    return {
      data: {
        data: category,
        message: message,
      },
    };
  }



  //根据分类名称查询
  
  @Get(':name')
  @ApiOperation({ summary: '根据分类名称查询分类' })
  @ApiResponse({ status: 200, description: '成功获取分类数据'})
  @UseGuards(JwtAuthGuard)
  async getCategoriesByName(@Param('name') name: string) {
      const categorylist=await this.categoryService.getCategoriesByName(name);
      
      return {
        data: categorylist,
      };
}

 






  // 获取某个父分类下的所有子分类
  @Get(':parentId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取某个父分类下的所有子分类' })
  @ApiResponse({ status: 200, description: '成功获取子分类列表' })
  getCategoriesByParentId(@Param('parentId') parentId: number) {
    return this.categoryService.getCategoriesByParentId(parentId);
  }

  // 添加分类
  //Prisma.CategoryCreateInput一个自动生成的类型，用于描述在数据库中创建 Category（分类）记录时所需要的字段结构
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '添加新的分类' })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({ status: 201, description: '成功添加分类'})
  createCategory(@Body() createCategoryDto:CreateCategoryDto ) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  //更新分类
  
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: UpdateCategoryDto })
  @ApiOperation({ summary: '更新分类信息' })
  @ApiResponse({ status: 200, description: '成功更新分类'})
  update(@Param('id') id:string, @Body() updateCategoryDto:UpdateCategoryDto ) {
    return this.categoryService.updateCategory(+id, updateCategoryDto)
  }

  
  //删除分类
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '删除分类' })
  @ApiResponse({ status: 200, description: '成功删除分类' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const value = await this.categoryService.remove(+id);
    return {
      data: {
        success: value.success,
        message: value.message,
      },
    };
  }
}
