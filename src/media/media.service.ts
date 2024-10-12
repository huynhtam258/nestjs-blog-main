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
      const imageId = data.public_id

      const media = await this._mediaRepository.createMedia(userId, url, imageId)
      return media
    } catch (error) {
      throw new HttpException("Can't upload media", HttpStatus.BAD_REQUEST)
    }
  }

  async getMediaByUserId(userId: number): Promise<{id: number, media_url: string, media_type: string}[]> {
    const media = await this._mediaRepository.findAllMediaByUserId(userId) as any[]
    return media 
  }

  async deleteImage (image_id: string) {
    try {
      const cloudinaryResponse = await this._cloudinaryService.deleteImage(image_id)
      await this._mediaRepository.deleteMedia(image_id)
      return cloudinaryResponse
    } catch (error) {
      throw new HttpException("Can't delete media", HttpStatus.BAD_REQUEST)
    }
  }
}
