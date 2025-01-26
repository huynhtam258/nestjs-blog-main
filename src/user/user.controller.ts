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
  UseInterceptors,
  Patch
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
// import { storageConfig } from 'helpers/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { CommonRequest } from 'src/core/interfaces/request.interface';
import { Pagination } from 'src/core/interfaces/pagination.interface';
// import { fileFilter } from 'utils/file';

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
  findAll(@Query() query: FilterUserDto): Promise<Pagination<User[]>> {
    return this.userService.findAll(query)
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  profile(@Req() req: CommonRequest): Promise<User> {
    return this.userService.findOne(req.user_data.id)
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(Number(id))
  }

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto)
  }

  @UseGuards(AuthGuard)
  @Put('profile')
  update(@Req() req: CommonRequest, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(Number(req.user_data.id), updateUserDto)
  }

  @UseGuards(AuthGuard)
  @Delete()
  delete(@Param('id') id: string) {
    return this.userService.delete(Number(id))
  }

  @UseGuards(AuthGuard)
  @Patch('upload-avatar')
  @UseInterceptors(FileInterceptor('file'))
  uploadAvatar(@Req() req: CommonRequest, @UploadedFile() file: Express.Multer.File) {
    return this.userService.updateAvatar(req.user_data.id, file);
  }
}
