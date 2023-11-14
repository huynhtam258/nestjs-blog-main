import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
  
  @Column({
    type: 'enum',
    enum: ["Electronics", "Clothing", "Furniture"],
  })
  product_type: ProductType;
}