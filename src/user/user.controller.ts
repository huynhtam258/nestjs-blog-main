import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    UseGuards,
    Param,
    Query,
    Req,
    UploadedFile,
    BadRequestException,
    UseInterceptors
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { extname } from 'path';
import { storageConfig } from 'helpers/config';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    @UseGuards(AuthGuard)
    @ApiQuery({ name: 'page' })
    @ApiQuery({ name: 'items_per_page' })
    @ApiQuery({ name: 'search' })
    @Get()
    findAll(@Query() query: FilterUserDto): Promise<User[]> {
        return this.userService.findAll(query)
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string): Promise<User> {
        console.log(id);

        return this.userService.findOne(Number(id))
    }

    @UseGuards(AuthGuard)
    @Post()
    create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.userService.create(createUserDto)
    }

    @UseGuards(AuthGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(Number(id), updateUserDto)
    }

    @UseGuards(AuthGuard)
    @Delete()
    delete(@Param('id') id: string) {
        return this.userService.delete(Number(id))
    }

    @UseGuards(AuthGuard)
    @Post('upload-avatar')
    @UseInterceptors(FileInterceptor('avatar', {
        storage: storageConfig('avatar'),
        fileFilter: (req, file, cb) => {
            const ext = extname(file.originalname);
            const allowedExtArr = ['.jpg', '.png', '.jpeg', '.webp'];

            // validation file type
            if (!allowedExtArr.includes(ext)) {
                req.fileValidationError = `Wrong extension type. Accepted file ext are: ${allowedExtArr.toString()}`;
                cb(null, false);
                return
            }

            // validation file size
            const fileSize = parseInt(req.headers['content-length']);
            const limit = 1024 * 1024 * 5
            if (fileSize > limit) {
                req.fileValidationError = 'File size is too large. Accepted file size is less than 5 MB';
                cb(null, false);
                return
            } 
            cb(null, true);
        }
    }))
    uploadAvatar(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
        if (req.fileValidationError) {
            throw new BadRequestException(req.fileValidationError);
        }
        if (!file) {
            throw new BadRequestException('File is required')
        }
        return this.userService.updateAvatar(req.user_data.id, file.destination + '/' + file.filename);
    }
}
