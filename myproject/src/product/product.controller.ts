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
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';

import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProDto } from './dto/createProduct.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  getSchemaPath,
} from '@nestjs/swagger';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth() //加锁输入jwt
  @ApiOperation({ summary: '创建商品' })
  @ApiBody({ type: CreateProDto })
  @ApiResponse({ status: 201, description: '商品创建成功' })
  @ApiResponse({ status: 400, description: '请求参数不合法' })
  create(@Body() createProductDto: CreateProDto) {
    return this.productService.create(createProductDto);
  }

  //查询所有商品
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth() //加锁输入jwt
  @ApiOperation({ summary: '查询所有商品' })
  @ApiResponse({
    status: 200,
    description: '返回所有商品',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object', // 每一项是一个对象
            allOf: [
              {
                $ref: getSchemaPath(CreateProDto), // 动态引入 CreateProDto
              },
              {
                properties: {
                  id: { type: 'number' }, // 新增 id 字段
                },
              },
            ],
          },
        },
      },
    },
  })
  async findAll() {
    const products = await this.productService.findAll();
    return {
      data: products,
    };
  }
  //按商品名模糊查询商品
  @Get('search')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth() //加锁输入jwt
  @ApiOperation({ summary: '按商品名模糊查询商品' })
  @ApiQuery({
    name: 'name',
    required: true,
    type: String,
    description: '商品名',
  })
  @ApiResponse({
    status: 200,
    description: '根据商品名返回商品列表',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object', // 每一项是一个对象
            allOf: [
              {
                $ref: getSchemaPath(CreateProDto), // 动态引入 CreateProDto
              },
              {
                properties: {
                  id: { type: 'number' }, // 新增 id 字段
                },
              },
            ],
          },
        },
      },
    },
  })
  async findMany(@Query('name') name: string) {
    const products = await this.productService.findMany(name);
    return {
      data: products,
    };
  }

  //按商品名查询商品

  @Get('name')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth() //加锁输入jwt
  @ApiOperation({ summary: '按商品名查询商品' })
  @ApiQuery({
    name: 'name',
    required: true,
    type: String,
    description: '商品名',
  })
  @ApiResponse({
    status: 200,
    description: '商品名存在时返回商品信息',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                type: 'object', // 每一项是一个对象
                allOf: [
                  {
                    $ref: getSchemaPath(CreateProDto), // 动态引入 CreateProDto
                  },
                  {
                    properties: {
                      id: { type: 'number' }, // 新增 id 字段
                    },
                  },
                ],
              },
            },
            message: { type: 'string' },
          },
        },
      },
    },
  })
  async findOne(@Query('name') name: string) {
   
    const products = await this.productService.findOneByName(name);
    let message = '';

    if (products) {
      message = '商品名存在';
    }
    return {
      data: {
        data: products,
        message: message,
      },
    };
  }

  //按分类查询商品
  @Get('category')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth() //加锁输入jwt
  @ApiOperation({ summary: '按分类查询商品' })
  @ApiQuery({
    name: 'categoryId',
    required: true,
    type: String,
    description: '分类ID',
  })
  @ApiResponse({ status: 200, description: '根据分类ID返回商品列表',schema: {
    type: 'object',
    properties: {
      data: {
        type: 'array',
        items: {
          type: 'object', // 每一项是一个对象
          allOf: [
            {
              $ref: getSchemaPath(CreateProDto), // 动态引入 CreateProDto
            },
            {
              properties: {
                id: { type: 'number' }, // 新增 id 字段
              },
            },
          ],
        },
      },
    },
  },})
  async categoriesfind(@Query('categoryId') categoryId: string) {
    const products = await this.productService.findByCategory(+categoryId);
    return {
      data: products,
    };
  }

  //商品图片上传接口
  @Post('upload')
  //处理文件上传的拦截器
  @UseInterceptors(
    FileInterceptor('image', {
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = path.join(process.cwd(),'uploads');
          
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
  @ApiOperation({ summary: '上传商品图片' })
  @ApiResponse({
    status: 200,
    description: '文件上传成功',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        file: { type: 'object' },
        url: { type: 'string' },
      },
    },
  })
 
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    // 返回图片的 URL（假设图片保存到本地的 'uploads' 文件夹）
    const imageUrl = `http://localhost:3000/uploads/${file.filename}`;

    // 文件上传成功，返回文件信息
    return res.status(200).json({
      message: 'File uploaded successfully!',
      file: file, // 这里会返回文件的详细信息，比如文件名、路径等
      url: imageUrl,
    });
  }

  //更新商品
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth() //加锁输入jwt
  @ApiOperation({ summary: '更新商品信息' })
  @ApiResponse({ status: 200, description: '商品信息更新成功' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  //删除商品
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth() //加锁输入jwt
  @ApiOperation({ summary: '删除商品' })
  @ApiResponse({ status: 200, description: '商品删除成功' })
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
