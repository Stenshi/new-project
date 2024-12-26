import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { ProductService } from './product.service';

import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProDto } from './dto/createProduct.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';

import {  Response } from 'express';
import * as path from 'path';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProDto ) {
    return this.productService.create(createProductDto);
  }

  //查询所有商品
  @Get()
  async findAll() {
    const products = await this.productService.findAll();
    return {
      data: products
    }
  }
  
  //商品图片上传接口
  @Post('upload')
  //处理文件上传的拦截器
  @UseInterceptors(FileInterceptor('image', {
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname,'uploads');
        cb(null, uploadPath);  // 存储文件的目录
      },
      filename: (req, file, cb) => {
        // 生成一个干净的文件名，避免特殊字符
      const timestamp = Date.now();
      const originalName = file.originalname;
      const cleanName = originalName.replace(/[^a-zA-Z0-9.-]/g, ''); // 替换非法字符
      const finalName = `${timestamp}-${cleanName}`;
      cb(null, finalName);  // 使用时间戳和清理过的文件名
      },
    }),
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File, @Res() res: Response) {
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    // 文件上传成功，返回文件信息
    return res.status(200).json({
      message: 'File uploaded successfully!',
      file: file,  // 这里会返回文件的详细信息，比如文件名、路径等
    });
  }

  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
