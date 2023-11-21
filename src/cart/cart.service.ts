import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { IProductInsert } from './dto/product-insert.dto';
import { ICart } from './interfaces/cart.interface';
import { PRODUCTS } from 'src/core/constant';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { Product } from 'src/product/entities/product.entity';
@Injectable()
export class CartService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) { }

  async createCart(): Promise<Cart> {
    const cart = this.cartRepository.create();
    return this.cartRepository.save(cart);
  }
  
  async addToCart(cartId: number, productId: number, quantity: number): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
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
  
    return this.cartRepository.save(cart);
  }

  async setCart(userId: number, products: IProductInsert[]) {
    // get product caching
    const productCaching = await this.cacheManager.get(PRODUCTS) as any[]
    if (!productCaching && !productCaching.length) {
      throw new HttpException("Error", HttpStatus.BAD_REQUEST)
    }
    
    const cart = {
      cart_id: `cart_${userId}`,
      products: products
    }
    
    await this.cacheManager.set(cart.cart_id, cart);
    return { success: true }
  }

  async getCart(userId: number): Promise<IProductInsert[]> {
    try {
      const cartData = await this.cacheManager.get(`cart_${userId}`) as ICart
      return cartData.products
    } catch (error) {
      throw new HttpException("Can't find cart", HttpStatus.BAD_REQUEST)
    }
  }

  async payment(userId: number) {
    try {
      const cartId = `cart_${userId}`
      const cartData = await this.cacheManager.get(cartId) as ICart
      // return cartData.products
      if (!cartData) {
        throw new HttpException("Can't find cart", HttpStatus.BAD_REQUEST)
      }
      // 1. save cart to mongodb
      // 2. remove caching cart
      this.cacheManager.del(cartId)
    } catch (error) {
      throw new HttpException("Can't find cart", HttpStatus.BAD_REQUEST)
    }
  }
}
