import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { MediaRepository } from './media.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule,
    ConfigModule
  ],
  controllers: [MediaController],
  providers: [
    MediaService,
    CloudinaryService,
    MediaRepository,
  ],
})
export class MediaModule {}
