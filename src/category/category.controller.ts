import { Controller, Get, UseGuards, Post, Body } from '@nestjs/common';
import { Category } from './entites/category.entity';
import { CategoryService } from './category.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('category')
export class CategoryController {
    constructor(
        private categoryService: CategoryService
    ) {}

    @Get()
    findAll():Promise<Category[]> {
        return this.categoryService.findAll();
    }

    @UseGuards(AuthGuard)
    @Post() 
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoryService.create(createCategoryDto);
    }
}
