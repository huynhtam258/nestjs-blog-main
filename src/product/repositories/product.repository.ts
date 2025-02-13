import { DataSource, Repository } from 'typeorm'
import { Product, Product as ProductEntity } from '../entities/product.entity';
import { Injectable } from '@nestjs/common';
import { PublishProduct } from '../dto/publish-product.dto';
import { CreateProductDto } from './../dto/create-product-dto';
import { FilterProductDto } from '../dto/filter-product.dto';
import { Pagination } from 'src/core/interfaces/pagination.interface';
import { DraftProduct } from '../dto/draft-product.dto';
import { ProductMedia } from 'src/product-media/entities/productMedia.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductReponsitory extends Repository<ProductEntity> {
  constructor(
    dataSource: DataSource,
    @InjectRepository(ProductMedia)
    private readonly productMediaReponsitory: Repository<ProductMedia>
  ) {
    super(ProductEntity, dataSource.createEntityManager())
  }
  
  async createProduct(productDto: CreateProductDto) {
    const { media, ...productData } = productDto;
  
    const product = this.create(productData);
    await this.save(product);
  
    if (media && media.length > 0) {
      const productMediaEntities = media.map(mediaId => {
        const productMedia = new ProductMedia();
        productMedia.productId = product.id;
        productMedia.mediaId = mediaId;
        return productMedia;
      });
      await this.productMediaReponsitory.save(productMediaEntities);
    }
  
    return product;
  }
  
  

  async findAll(query: FilterProductDto): Promise<Pagination<Product[]>> {
    const items_per_page = Number(query.items_per_page) || 10;
    const page = Number(query.page) || 1;
    const search = query.search || '';
    const skip = (page - 1) * items_per_page;
  
    const [res, total] = await this.createQueryBuilder('product')
      .leftJoinAndSelect('product.media', 'media', 'media.is_deleted = :isDeleted', { isDeleted: false })
      .select(['product', 'media.media_url', 'media.image_id'])
      .where('product.isDraft = false')
      .orderBy('product.created_at', 'DESC')
      .take(items_per_page)
      .skip(skip)
      .getManyAndCount();
  
    const lastPage = Math.ceil(total / items_per_page);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;
  
    return {
      data: res,
      total,
      currentPage: page,
      nextPage,
      prevPage,
      lastPage,
    };
  }  

  async findDetail(productId: number) {
    const product = await this.createQueryBuilder('product')
      .leftJoinAndSelect('product.media', 'media', 'media.is_deleted = :isDeleted', { isDeleted: false })
      .select(['product', 'media.media_url', 'media.image_id'])
      .where('product.id = :productId', { productId })
      .getOne();
  
    return product;
  }
  
  async updatePublishProduct (product: ProductEntity, publishProduct: PublishProduct) {
    return await this.update(publishProduct.productId, {
      ...product,
      isPublish: publishProduct.isPublish
    })
  }

  async updateDraftProduct (product: ProductEntity, draftProduct: DraftProduct) {
    return await this.update(draftProduct.productId, {
      ...product,
      isDraft: draftProduct.isDraft
    })
  }

  async updateProduct (productId: number, product: ProductEntity) {
    return await this.update(productId, {
      ...product,
    })
  }
}