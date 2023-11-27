import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryProvider } from './cloudinary/cloudinary';
import { CloudinaryController } from './cloudinary.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    JwtModule,
    ConfigModule
  ],
  providers: [CloudinaryService, CloudinaryProvider],
  controllers: [CloudinaryController]
})
export class CloudinaryModule {}
