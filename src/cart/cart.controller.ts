import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { CommonRequest } from 'src/core/interfaces/request.interface';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) { }

  @UseGuards(AuthGuard)
  @Post('/add-to-cart')
  async addToCart(@Req() req: CommonRequest, @Body() addToCartDto: AddToCartDto) {
    const { cartId, productId, quantity } = addToCartDto;
    return this.cartService.addToCart(Number(req.user_data.id), cartId, productId, quantity);
  }

  @UseGuards(AuthGuard)
  @Post('')
  create(@Req() req: CommonRequest) {
    return this.cartService.createCart(Number(req.user_data.id));
  }
}
