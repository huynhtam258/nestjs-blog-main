import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entites/category.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { CartRepository } from 'src/cart/repositories/cart.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    JwtModule,
    ConfigModule
  ],
  controllers: [CategoryController],
  providers: [CategoryService, CartRepository]
})
export class CategoryModule {}
