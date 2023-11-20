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

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) { }

  @Post(':id')
  @UsePipes(ValidationPipe)
  setCart(@Param('id') id: string, @Body() data: any) {
    return this.cartService.setCart(Number(id), data.products)
  }

  @Get(':id')
  async getCart(@Param('id') id: string) {
    return this.cartService.getCart(Number(id))
  }

  @Delete(':id')
  async payment(@Param('id') id: string) {
    return this.cartService.payment(Number(id))
  }
}
