import { DataSource, Repository } from 'typeorm'
import { Product, Product as ProductEntity } from '../entities/product.entity';
import { Injectable } from '@nestjs/common';
import { PublishProduct } from '../dto/publish-product.dto';
import { CreateProductDto } from './../dto/create-product-dto';
import { FilterProductDto } from '../dto/filter-product.dto';
import { Pagination } from 'src/core/interfaces/pagination.interface';

@Injectable()
export class ProductReponsitory extends Repository<ProductEntity> {
  constructor(dataSource: DataSource) {
    super(ProductEntity, dataSource.createEntityManager())
  }
  
  async createProduct (product: CreateProductDto) {
    return await this.save(product)
  }

  async findAll (query: FilterProductDto): Promise<Pagination<Product[]>> {
    const items_per_page = Number(query.items_per_page) || 10;

    const page = Number(query.page) || 1

    const search = query.search || ''

    const skip = (page - 1) * items_per_page

    const [res, total] = await this.findAndCount({
      where: [
        {
          isDraft: false
        }
      ],
      take: items_per_page,
      skip: skip
    })

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