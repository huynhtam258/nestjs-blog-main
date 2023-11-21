import { Product } from "src/product/entities/product.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "./cart.entity";

@Entity()
export class CartItem {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Product)
    product: Product

    @ManyToOne(() => Cart, cart => cart.items)
    cart: Cart;
    
    @Column()
    quantity: number;
}