import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { Product } from './entities/product.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ProductReponsitory } from './repositories/product.repository';
import { CacheModule } from '@nestjs/cache-manager'
@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    JwtModule,
    ConfigModule,
    CacheModule.register()
  ],
  controllers: [ProductController],
  providers: [ProductService, CloudinaryService, ProductReponsitory]
})
export class ProductModule {}
