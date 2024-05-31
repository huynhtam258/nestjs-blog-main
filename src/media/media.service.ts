import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Media } from './entities/media.entity';
import { MediaRepository } from './media.repository';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class MediaService {

  constructor(
    private _mediaRepository: MediaRepository,
    private _cloudinaryService: CloudinaryService
  ) { }

  async uploadFile(userId: number, file: Express.Multer.File): Promise<Media> {
    try {
      const cloudinaryResponse = await this._cloudinaryService.uploadFile(file)

      const data = await cloudinaryResponse
      if (!data || !data.url) {
        throw new HttpException("Can't upload media", HttpStatus.BAD_REQUEST)
      }

      const url = (data.url || '') as string

      const media = await this._mediaRepository.createMedia(userId, url)
      return media
    } catch (error) {
      console.log(error)
      throw new HttpException("Can't upload media", HttpStatus.BAD_REQUEST)
    }
  }
}
