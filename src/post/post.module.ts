import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import { PostReponsitory } from './repositories/post.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, User]),
    JwtModule,
    ConfigModule
  ],
  controllers: [PostController],
  providers: [PostService, PostReponsitory]
})
export class PostModule {}
