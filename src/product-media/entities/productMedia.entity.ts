import { Media } from "src/media/entities/media.entity";
import { Product } from "src/product/entities/product.entity";
import { Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('product_media')
export class ProductMedia {
  @PrimaryColumn({ name: 'product_id'})
  productId: number
  
  @PrimaryColumn({ name: 'media_id'})
  mediaId: number

  @ManyToOne(
    () => Product,
    product => product.medias,
    {onDelete: 'NO ACTION', onUpdate: 'NO ACTION'}
  )
  @JoinColumn([{ name: 'product_id', referencedColumnName: 'id' }])
  products: Product[]

  @ManyToOne(
    () => Media,
    media => media.products,
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' }
  )
  @JoinColumn([{ name: 'media_id', referencedColumnName: 'id' }])
  medias: Media[]
}