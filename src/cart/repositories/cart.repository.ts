import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Cart as CartEntity } from 'src/cart/entities/cart.entity'
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "src/product/entities/product.entity";
import { CartItem } from "../entities/cart-item.entity";
import { User } from "src/user/entities/user.entity";

@Injectable()
export class CartRepository extends Repository<CartEntity> {
  constructor (
    dataSource: DataSource,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,   
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {
    super(CartEntity, dataSource.createEntityManager())
  }

  async createCart(userId: number): Promise<CartEntity> {
    const user = await this.userRepository.findOneBy({ id: userId })

    if (!user) {
      throw new HttpException("Can't find user", HttpStatus.BAD_REQUEST)
    }

    const cart = await this.save({  user });
    return cart
  }

  async addToCart(userId: number, cartId: number, productId: number, quantity: number) {
    const cart = await this.findOne({
      where: {
        id: cartId
      },
      relations: ['items', 'items.product']
    });
    
    const product = await this.productRepository.findOne({
      where: {
        id: productId
      }
    });
    
    let cartItem = cart.items.find(item => item.product.id === productId);
    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cartItem = await this.cartItemRepository.save({ product, quantity });
      cart.items.push(cartItem);
    }
  
    return this.save(cart);
  }

  async getCart(userId: number, cartId: number): Promise<CartEntity> {
    const cart = await this.findOne({
      where: {
        id: cartId,
        user: {
          id: userId
        }
      },
      relations: ['items', 'items.product']
    })
    return cart
  }
}