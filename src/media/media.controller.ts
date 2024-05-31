import { Controller, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';
import { MediaService } from './media.service';
import { CommonRequest } from 'src/core/interfaces/request.interface';

@Controller('media')
export class MediaController {
  constructor(private mediaService: MediaService) { }
  
  @UseGuards(AuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@Req() req: CommonRequest, @UploadedFile() file: Express.Multer.File) {
    const { user_data } = req
    return this.mediaService.uploadFile(Number(user_data.id), file);
  }
}
