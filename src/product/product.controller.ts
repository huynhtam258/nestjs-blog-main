import { Body, Controller, Get, Param, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CommonRequest } from 'src/core/interfaces/request.interface';
import { CreateProductDto } from './dto/create-product-dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('products')
export class ProductController {
    constructor(private productService: ProductService) {}

    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    @Post()
    create(@Req() req: CommonRequest, @Body() createProductDto: CreateProductDto) {
        return this.productService.create(createProductDto);
    }

    @Put('upload-thumbnail/:id')
    @UseInterceptors(FileInterceptor('file'))
    updateImageProduct(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
        return this.productService.updateImage(Number(id), file)
    }

    @Get(":id")
    findDetai(@Param('id') id: string) {
        return this.productService.findDetail(Number(id))
    }
}
