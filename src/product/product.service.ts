import { HttpException, HttpStatus, Inject, Injectable, Query } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product-dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FilterProductDto } from './dto/filter-product.dto';
import { Pagination } from 'src/core/interfaces/pagination.interface';
import { PublishProduct } from './dto/publish-product.dto';
import { ProductReponsitory } from './repositories/product.repository';

import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { PRODUCTS } from 'src/core/constant';
import { DraftProduct } from './dto/draft-product.dto';

@Injectable()
export class ProductService {
  constructor(
    private _productRepository: ProductReponsitory,
    private cloudinaryService: CloudinaryService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }

  public async findAll(@Query() query: FilterProductDto): Promise<Pagination<Product[]>> {
    return await this._productRepository.findAll(query)
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

      return await this._productRepository.updateProduct(productId, { ...product, product_thumb: thumbnail })
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

  public async draftProduct(draftProduct: DraftProduct) {
    try {
      const productId = draftProduct.productId
      const product = await this._productRepository.findDetail(productId)

      if (!product) {
        throw new HttpException("Can't find product", HttpStatus.BAD_REQUEST)
      }

      return await this._productRepository.updateDraftProduct(product, draftProduct)

    } catch (error) {
      throw new HttpException("Can't update product", HttpStatus.BAD_REQUEST)
    }
  }
}
