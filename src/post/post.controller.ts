import { 
    Controller, 
    Get, 
    Post, 
    Put,
    Req, 
    Query, 
    Body, 
    Param,
    UseInterceptors,
    UploadedFile, 
    UseGuards, 
    UsePipes, 
    ValidationPipe, 
    BadRequestException,
    Delete
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { FileInterceptor } from '@nestjs/platform-express'
import { storageConfig } from 'helpers/config';
import { AuthGuard } from 'src/auth/auth.guard';
import { PostService } from './post.service';
import { FilterPostDto } from './dto/filter-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { fileFilter } from './../../utils/file'
import { CommonRequest } from 'src/core/interfaces/request.interface';
import { Pagination } from 'src/core/interfaces/pagination.interface';
import { Post as PostEntity } from './entities/post.entity';

@Controller('post')
export class PostController {
    constructor(private postService: PostService) {}

    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    @Post()
    // @UseInterceptors(FileInterceptor('thumbnail', {
    //     storage: storageConfig('post'),
    //     fileFilter: fileFilter
    // }))
    create(@Req() req: CommonRequest, @Body() createPostDto: CreatePostDto) {
        // console.log(file);
        
        // if (req.fileValidationError) {
        //     throw new BadRequestException(req.fileValidationError);
        // }
        // if (!file) {
        //     throw new BadRequestException('File is required')
        // }

        return this.postService.create(+createPostDto.user, { ...createPostDto, thumbnail: '' });
    }

    @Get()
    findAll(@Query() query: FilterPostDto): Promise<Pagination<PostEntity[]>> {
        return this.postService.findAll(query)
    }

    @Get(':id')
    findDetail(@Param('id') id: string) {
        return this.postService.findDetail(Number(id))
    }
    
    @UseGuards(AuthGuard)
    @Put(':id')
    @UseInterceptors(FileInterceptor('thumbnail', {
        storage: storageConfig('post'),
        fileFilter: fileFilter
    }))
    update(@Param('id') id: string, @Req() req: CommonRequest, @Body() updatePostDto: UpdatePostDto, @UploadedFile() file: Express.Multer.File) {
        if (req.fileValidationError) {
            throw new BadRequestException(req.fileValidationError)
        }

        if (file) {
            updatePostDto.thumbnail = file.destination + '/' + file.filename;
        }

        return this.postService.update(Number(id), updatePostDto)
    }
    @UseGuards(AuthGuard)
    @Delete(':id')
    delete(@Param('id') id: string) {
        console.log(id);
        
        return this.postService.delete(Number(id))
    }
}
