import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entites/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category) private categoryRepository: Repository<Category>
    ) {}

    async findAll():Promise<Category[]> {
        return await this.categoryRepository.find();
    }

    async create(createCategoryDto: CreateCategoryDto): Promise<Category>{
        try {   
            const category = await this.categoryRepository.save({
               ...createCategoryDto
            })
            return category
        } catch (error) {
            throw new HttpException("Can't create category", HttpStatus.BAD_REQUEST)
        }
        
    }
}
