import { Media } from "src/media/entities/media.entity";
// import { ProductMedia } from "src/product-media/entities/productMedia.entity";
import { Column, CreateDateColumn, Entity, Index, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

type ProductType = "Electronics" | "Clothing" | "Furniture"
@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  product_name: string;

  @Column()
  product_thumb: string;

  @Column()
  product_slug: string;

  @Column()
  product_description: string;

  @Column()
  product_price: number;

  @Column()
  product_quantity: number;
  
  @Column({
    type: 'enum',
    enum: ["Electronics", "Clothing", "Furniture"],
  })
  product_type: ProductType;

  @Column({ type: 'boolean', default: false })
  @Index()
  isDraft: boolean;

  @Column({ type: 'boolean', default: false })
  @Index()
  isPublish: boolean;

  @CreateDateColumn()
  created_at: Date

  @CreateDateColumn()
  updated_at: Date

  @ManyToMany(
    () => Media, media => media.products,
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' }
  )
  @JoinTable({
    name: 'product_media',
    joinColumn: {
      name: 'product_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'media_id',
      referencedColumnName: 'id',
    }
  })
  media?: Media[]
}