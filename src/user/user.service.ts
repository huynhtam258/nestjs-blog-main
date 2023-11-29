import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity';
import { Repository, UpdateResult, DeleteResult, Like } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt'
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { Pagination } from 'src/core/interfaces/pagination.interface';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private cloudinaryService: CloudinaryService,
  ) {

  }

  async findAll(query: FilterUserDto): Promise<Pagination<User[]>> {
    const items_per_page = Number(query.items_per_page) || 10;
    const page = Number(query.page) || 1;
    const skip = (page - 1) * items_per_page;
    const keyword = query.search || ''

    const [res, total] = await this.userRepository.findAndCount({
      where: [
        { first_name: Like('%' + keyword + '%') },
        { last_name: Like('%' + keyword + '%') },
        { email: Like('%' + keyword + '%') }
      ],
      order: { created_at: "DESC" },
      take: items_per_page,
      skip: skip,
      select: ['id', 'first_name', 'last_name', 'email', 'status', 'created_at', 'updated_at']
    })
    const lastPage = Math.ceil(total / items_per_page);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page

    return {
      data: res,
      total,
      currentPage: page,
      nextPage,
      prevPage,
      lastPage,
    }
  }

  async findOne(id: number) {
    return this.userRepository.findOneBy({
      id: id
    })
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashPassword = await this.hashPassword(createUserDto.password)
    return this.userRepository.save({
      ...createUserDto,
      resfresh_token: '',
      password: hashPassword
    })
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UpdateResult> {
    return await this.userRepository.update(id, updateUserDto);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  };

  async updateAvatar(id: number, file: Express.Multer.File): Promise<UpdateResult> {

    try {
      const user = await this.userRepository.findOneBy({
        id: id
      })
      const cloudinaryResult = await this.cloudinaryService.uploadFile(file)
      const avatar_url = cloudinaryResult.url
      console.log(cloudinaryResult);

      return await this.userRepository.update(id, { ...user, avatar: avatar_url });
    } catch (error) {

    }

  };
}
