import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository,  } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User }  from './../user/entities/user.entity'
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Post) private postRepository: Repository<Post>
    ) {}
    public async create(userId: number, createPostDto: CreatePostDto): Promise<Post> {
        const user = await this.userRepository.findOneBy({ id: userId })
        try {
            return await this.postRepository.save({
                ...createPostDto,
                user
            })
        } catch (error) {
            throw new HttpException("Can't create post", HttpStatus.BAD_REQUEST)
        }
    }
}
