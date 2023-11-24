import { DataSource, Repository } from 'typeorm'
import { Product as ProductEntity } from '../entities/product.entity';
import { Injectable } from '@nestjs/common';
import { PublishProduct } from '../dto/publish-product.dto';
import { CreateProductDto } from './../dto/create-product-dto';

@Injectable()
export class ProductReponsitory extends Repository<ProductEntity> {
  constructor(dataSource: DataSource) {
    super(ProductEntity, dataSource.createEntityManager())
  }
  
  async createProduct (product: CreateProductDto) {
    return await this.save(product)
  }

  async findAll (items_per_page: number, skip: number) {
    return await this.findAndCount({
      where: [
        {
          isPublish: true
        }
      ],
      take: items_per_page,
      skip: skip
    })
  }

  async findDetail(productId: number) {
    return await this.findOne({
      where: {
        id: productId
      }
    })
  }

  async updatePublishProduct (product: ProductEntity, publishProduct: PublishProduct) {
    return await this.update(publishProduct.productId, {
      ...product,
      isDraft: !publishProduct.isPublish,
      isPublish: publishProduct.isPublish
    })
  }

  async updateProduct (productId: number, product: ProductEntity) {
    return await this.update(productId, {
      ...product,
    })
  }
}