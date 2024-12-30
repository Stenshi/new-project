import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Res,
  Query,
  Req,
} from '@nestjs/common';
import { ProductService } from './product.service';

import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProDto } from './dto/createProduct.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';

import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProDto) {
    return this.productService.create(createProductDto);
  }

  //查询所有商品
  @Get()
  async findAll() {
    const products = await this.productService.findAll();
    return {
      data: products,
    };
  }
  //按商品名模糊查询商品
  @Get('search')
  async findMany(@Query('name') name: string) {
    const products = await this.productService.findMany(name);
    return {
      data: products,
    };
  }

  //按商品名查询商品
  @Get('name')
  async findOne(@Query('name') name: string) {
    const products = await this.productService.findOneByName(name);
    let message = '';
    
    if (products) {
      message = '商品名存在';
    }
    return {
      data: {
        data:products,
        message: message
      }
    };
  }

  //商品图片上传接口
  @Post('upload')
  //处理文件上传的拦截器
  @UseInterceptors(
    FileInterceptor('image', {
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = path.join(__dirname, 'uploads');
          console.log('Upload path:', uploadPath); // 打印上传文件夹的路径
          // 检查目录是否存在并创建
          fs.promises
            .access(uploadPath, fs.constants.F_OK)
            .catch(() => {
              return fs.promises.mkdir(uploadPath, { recursive: true });
            })
            .then(() => {
              cb(null, uploadPath); // 目录存在或已创建，继续上传
            })
            .catch((err) => {
              cb(err, null); // 如果创建失败，回调错误
            });
        },
        filename: (req, file, cb) => {
          // 生成一个干净的文件名，避免特殊字符
          const timestamp = Date.now();
          const originalName = file.originalname;
          const cleanName = originalName.replace(/[^a-zA-Z0-9.-]/g, ''); // 替换非法字符
          const finalName = `${timestamp}-${cleanName}`;
          cb(null, finalName); // 使用时间戳和清理过的文件名
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File,@Req() req:Request, @Res() res: Response) {
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    // 返回图片的 URL（假设图片保存到本地的 'uploads' 文件夹）
    const imageUrl = `http://localhost:3000/uploads/${file.filename}`;
    console.log(file);
    // 文件上传成功，返回文件信息
    return res.status(200).json({
      message: 'File uploaded successfully!',
      file: file, // 这里会返回文件的详细信息，比如文件名、路径等
      url: imageUrl
    });
  }

  @Patch(':name')
  update(@Param('name') name: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(name, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
