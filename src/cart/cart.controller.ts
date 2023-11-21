import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) { }

  @Post('/add-to-cart')
  async addToCart(@Body() addToCartDto: AddToCartDto) {
    const { cartId, productId, quantity } = addToCartDto;
    return this.cartService.addToCart(cartId, productId, quantity);
  }

  @Post(':id')
  create(@Param('id') id: string) {
    return this.cartService.createCart(Number(id));
  }
}
