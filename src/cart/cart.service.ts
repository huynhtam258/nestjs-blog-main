import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) { }

  async createCart(userId: number): Promise<Cart> {
    const user = await this.userRepository.findOneBy({ id: userId })

    if (!user) {
      throw new HttpException("Can't find user", HttpStatus.BAD_REQUEST)
    }
    const cart = await this.cartRepository.save({  user });
    return cart
  }

  async addToCart(userId: number, cartId: number, productId: number, quantity: number): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: {
        id: cartId
      },
      relations: ['items', 'items.product']
    });
    // if (cart.user.id !== userId) {
    //   throw new HttpException("Can't find cart", HttpStatus.BAD_REQUEST)
    // }
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
  
    return this.cartRepository.save(cart);
  }

  async getCart(userId: number, cartId: number) {
    const cart = await this.cartRepository.findOne({
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
