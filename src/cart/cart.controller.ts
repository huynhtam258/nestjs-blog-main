import {
  Body,
  Controller,
  Get,
  Param,
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
  addToCart(@Req() req: CommonRequest, @Body() addToCartDto: AddToCartDto) {
    const { cartId, productId, quantity } = addToCartDto;
    return this.cartService.addToCart(Number(req.user_data.id), cartId, productId, quantity);
  }

  @UseGuards(AuthGuard)
  @Post('')
  create(@Req() req: CommonRequest) {
    return this.cartService.createCart(Number(req.user_data.id));
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  getCart(@Req() req: CommonRequest, @Param('id') id: string) {
    return this.cartService.getCart(Number(req.user_data.id), Number(id))
  }
}
