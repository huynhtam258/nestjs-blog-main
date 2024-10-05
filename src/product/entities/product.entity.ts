import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

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
}