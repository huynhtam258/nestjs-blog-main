import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product-dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product) private productRepository: Repository<Product>,
        private cloudinaryService: CloudinaryService
    ) { }

    public async create(createProductDto: CreateProductDto): Promise<Product> {
        try {
            const product = await this.productRepository.save(createProductDto)
            return product
        } catch (error) {
            throw new HttpException("Can't create product", HttpStatus.BAD_REQUEST)
        }
    }

    public async updateImage(productId: number, file: Express.Multer.File) {
        try {
            const product = this.productRepository.findOne({
                where: {
                    id: productId
                }
            })

            if (!product) {
                throw new HttpException("Can't find product", HttpStatus.BAD_REQUEST)
            }

            const cloudinaryResult = await this.cloudinaryService.uploadFile(file)
            const thumbnail = cloudinaryResult.url

            return await this.productRepository.update(productId, { ...product, product_thumb: thumbnail })
        } catch (error) {
            throw new HttpException("Can't update image product", HttpStatus.BAD_REQUEST)
        }
    }

    public async findDetail(productId: number) {
        return await this.productRepository.findOne({
            where: {
                id: productId
            }
        })
    }
}
