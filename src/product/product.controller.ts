import { Body, Controller, Get, Param, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CommonRequest } from 'src/core/interfaces/request.interface';
import { CreateProductDto } from './dto/create-product-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilterProductDto } from './dto/filter-product.dto';
import { Pagination } from 'src/core/interfaces/pagination.interface';
import { Product as ProductEntity } from './entities/product.entity';
@Controller('products')
export class ProductController {
    constructor(private productService: ProductService) {}

    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    @Post()
    create(@Body() createProductDto: CreateProductDto) {
        return this.productService.create(createProductDto);
    }

    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    @Put('upload-thumbnail/:id')
    @UseInterceptors(FileInterceptor('file'))
    updateImageProduct(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
        return this.productService.updateImage(Number(id), file)
    }

    @Get(":id")
    findDetail(@Param('id') id: string) {
        return this.productService.findDetail(Number(id))
    }
    
    @Get()
    findAll(@Query() query: FilterProductDto): Promise<Pagination<ProductEntity[]>> {
        return this.productService.findAll(query)
    }

}
