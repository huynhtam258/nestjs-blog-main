import { HttpException, HttpStatus, Inject, Injectable, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product-dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FilterProductDto } from './dto/filter-product.dto';
import { Pagination } from 'src/core/interfaces/pagination.interface';
import { PublishProduct } from './dto/publish-product.dto';
import { ProductReponsitory } from './repositories/product.repository';

@Injectable()
export class ProductService {
  constructor(
    private _productRepository: ProductReponsitory,
    private cloudinaryService: CloudinaryService
  ) { }

  public async findAll(@Query() query: FilterProductDto): Promise<Pagination<Product[]>> {
    const items_per_page = Number(query.items_per_page) || 10;

    const page = Number(query.page) || 1

    const search = query.search || ''

    const skip = (page - 1) * items_per_page

    const [res, total] = await this._productRepository.findAll(items_per_page, skip)

    const lastPage = Math.ceil(total / items_per_page);
    const nextPage = page + 1 > lastPage ? null : page + 1
    const prevPage = page - 1 < 1 ? null : page - 1;

    return {
      data: res,
      total,
      currentPage: page,
      nextPage,
      prevPage,
      lastPage
    }
  }

  public async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const product = await this._productRepository.createProduct(createProductDto)
      return product
    } catch (error) {
      throw new HttpException("Can't create product", HttpStatus.BAD_REQUEST)
    }
  }

  public async updateImage(productId: number, file: Express.Multer.File) {
    try {
      const product = await this._productRepository.findDetail(productId)

      if (!product) {
        throw new HttpException("Can't find product", HttpStatus.BAD_REQUEST)
      }

      const cloudinaryResult = await this.cloudinaryService.uploadFile(file)
      const thumbnail = cloudinaryResult.url

      return await this._productRepository.update(productId, { ...product, product_thumb: thumbnail })
    } catch (error) {
      throw new HttpException("Can't update image product", HttpStatus.BAD_REQUEST)
    }
  }

  public async findDetail(productId: number) {
    try {
      const product = this._productRepository.findDetail(productId)
      if (!product) {
        throw new HttpException("Can't find product", HttpStatus.BAD_REQUEST)
      }
      return product
    } catch (error) {
      throw new HttpException("Can't find product", HttpStatus.BAD_REQUEST)
    }
  }

  public async publishProduct(publishProduct: PublishProduct) {
    try {
      const productId = publishProduct.productId
      const product = await this._productRepository.findDetail(productId)

      if (!product) {
        throw new HttpException("Can't find product", HttpStatus.BAD_REQUEST)
      }

      return await this._productRepository.updatePublishProduct(product, publishProduct)

    } catch (error) {
      throw new HttpException("Can't update product", HttpStatus.BAD_REQUEST)
    }
  }
}
