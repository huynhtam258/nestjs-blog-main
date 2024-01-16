import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PostModule } from './post/post.module';
import { CategoryModule } from './category/category.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { CacheModule } from '@nestjs/cache-manager';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: 'blogDev',
      entities: ['dist/**/*.entity.js'],
      migrations: ['dist/db/migrations/*.js'],
      synchronize: false
  }),
    UserModule,
    AuthModule,
    PostModule,
    CategoryModule,
    CloudinaryModule,
    ProductModule,
    CartModule,
    CacheModule.register({
      ttl: 0 // mili seconds
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
