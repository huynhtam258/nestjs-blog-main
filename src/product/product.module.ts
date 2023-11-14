import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { Product } from './entities/product.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    JwtModule,
    ConfigModule
  ],
  controllers: [ProductController],
  providers: [ProductService, CloudinaryService]
})
export class ProductModule {}
