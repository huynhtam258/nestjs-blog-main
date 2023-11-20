import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CacheModule } from '@nestjs/cache-manager'

@Module({
  imports: [
    CacheModule.register()
  ],
  controllers: [CartController],
  providers: [CartService]
})
export class CartModule { }
