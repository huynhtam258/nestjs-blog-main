import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CartItem } from "./cart-item.entity";
import { User } from "src/user/entities/user.entity";

type CartStatus = 'INCART' | 'PENDING' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED'
@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => CartItem, cartItem => cartItem.cart)
  items: CartItem[];

  @ManyToOne(() => User, user => user.carts)
  @JoinColumn()
  user: User;

  @Column({
    type: 'enum',
    enum: ['INCART', 'PENDING', 'SHIPPING', 'DELIVERED', 'CANCELLED']
  })
  cart_status: CartStatus
}
