import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Cart } from './entities/cart.entity';
import { CartRepository } from './repositories/cart.repository';
@Injectable()
export class CartService {
  constructor( private _cartRepository: CartRepository ) { }

  async createCart(userId: number): Promise<Cart> {
    try {
      const cart = await this._cartRepository.createCart(userId)
      return cart
    } catch (error) {
      throw new HttpException("Can't create cart", HttpStatus.BAD_REQUEST)
    }
  }

  async addToCart(userId: number, cartId: number, productId: number, quantity: number): Promise<Cart> {
    try {
      const cart = await this._cartRepository.addToCart(userId, cartId, productId, quantity)
      return cart
    } catch (error) {
      throw new HttpException("Can't add to cart", HttpStatus.BAD_REQUEST)
    }
  }

  async getCart(userId: number, cartId: number): Promise<Cart> {
    try {
      const cart = await this._cartRepository.getCart(userId, cartId);
      return  cart
    } catch (error) {
      throw new HttpException("Can't find to cart", HttpStatus.BAD_REQUEST)
    }
  }
}
