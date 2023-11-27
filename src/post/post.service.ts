import { Injectable, HttpException, HttpStatus, Query } from '@nestjs/common';
import { InjectRepository,  } from '@nestjs/typeorm';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';
import { User }  from './../user/entities/user.entity'
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { FilterPostDto } from './dto/filter-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Pagination } from 'src/core/interfaces/pagination.interface';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Post) private postRepository: Repository<Post>
    ) {}
    public async create(userId: number, createPostDto: CreatePostDto): Promise<Post> {
        const user = await this.userRepository.findOneBy({ id: userId })
        try {
            const post = await this.postRepository.save({
                ...createPostDto,
                publish: false,
                user
            })
            return post
        } catch (error) {
            throw new HttpException("Can't create post", HttpStatus.BAD_REQUEST)
        }
    }

    public async findAll (@Query() query: FilterPostDto): Promise<Pagination<Post[]>> {
        const items_per_page = Number(query.items_per_page) || 10;
        const page = Number(query.page) || 1;
        const search = query.search || '';
        const category = Number(query.category) || null;

        const skip = (page - 1) * items_per_page;

        const [res, total] = await this.postRepository.findAndCount({
            where: [
                {
                    title: Like('%' + search + '%')
                },
                {
                    description: Like('%' + search + '%')
                }
            ],
            order: { created_at: 'DESC' },
            take: items_per_page,
            skip: skip,
            relations: {
                user: true
            },
            select: {
                user: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    email: true,
                    avatar: true
                }
            }
        })

        const lastPage = Math.ceil(total / items_per_page);
        const nextPage = page + 1 > lastPage ? null : page + 1;
        const prevPage = page - 1 < 1 ? null : page - 1;

        return {
            data: res,
            total,
            currentPage: page,
            nextPage,
            prevPage,
            lastPage
        }
    }

    public async findDetail(postId: number): Promise<Post> {
        return await this.postRepository.findOne({
            where: {
                id: postId
            },
            relations: ['user'],
            select: {
                user: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    email: true,
                    avatar: true
                }
            }
        })
    }

    public async update(id: number, updatePostDto: UpdatePostDto): Promise<UpdateResult> {
        return await this.postRepository.update(id, updatePostDto)
    }
    
    public async delete(id: number): Promise<DeleteResult> {
        return await this.postRepository.delete(id);
    };

}
