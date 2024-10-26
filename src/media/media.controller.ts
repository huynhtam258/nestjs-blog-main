import { Controller, Get, Param, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';
import { MediaService } from './media.service';
import { CommonRequest } from 'src/core/interfaces/request.interface';
import { fileFilter } from 'utils/file';

@Controller('media')
export class MediaController {
  constructor(private mediaService: MediaService) { }
  
  @UseGuards(AuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter
  }))
  uploadImage(@Req() req: CommonRequest, @UploadedFile() file: Express.Multer.File) {
    const { user_data } = req
    return this.mediaService.uploadFile(Number(user_data.id), file);
  }

  @UseGuards(AuthGuard)
  @Get('')
  getMediaBygUserId(@Req() req: CommonRequest) {
    const { user_data } = req
    return this.mediaService.getMediaByUserId(Number(user_data.id))
  }

  @UseGuards(AuthGuard)
  @Patch('/delete/:id')
  deleteImage(@Param('id') id: string ) {
    return this.mediaService.deleteImage(id);
  }
}
