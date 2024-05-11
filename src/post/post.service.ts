import { Injectable, HttpException, HttpStatus, Query } from '@nestjs/common';
import { InjectRepository, } from '@nestjs/typeorm';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';
import { User } from './../user/entities/user.entity'
import { Post  } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { FilterPostDto } from './dto/filter-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Pagination } from 'src/core/interfaces/pagination.interface';
import { PostRepository } from './repositories/post.repository';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private _postRepository: PostRepository
  ) { }
  public async create(userId: number, createPostDto: CreatePostDto): Promise<Post> {
    try {
      const user = await this.userRepository.findOneBy({ id: userId })
      
      if (!user) {
        throw new HttpException("Can't find user", HttpStatus.BAD_REQUEST)
      }
      
      const post = await this._postRepository.createPost(createPostDto, user)
      return post

    } catch (error) {
      throw new HttpException("Can't create post", HttpStatus.BAD_REQUEST)
    }
  }

  public async findAll(@Query() query: FilterPostDto): Promise<Pagination<Post[]>> {
    try {
      return await this._postRepository.findAllPost(query)
    } catch (error) {
      throw new HttpException("Can't find all posts", HttpStatus.BAD_REQUEST)
    }
  }

  public async findDetail(postId: number): Promise<Post> {
    try {
      const post = await this._postRepository.findDetail(postId)
      if (!post) {
        throw new HttpException("Can't find post", HttpStatus.BAD_REQUEST)
      }
      return post
    } catch (error) {
      throw new HttpException("Can't find post", HttpStatus.BAD_REQUEST)
    }
  }

  public async update(id: number, updatePostDto: UpdatePostDto): Promise<UpdateResult> {
    try {
      const post = this._postRepository.findDetail(id)
      if (!post) {
        throw new HttpException("Can't find post", HttpStatus.BAD_REQUEST)
      }

      return await this._postRepository.updatePost(id, updatePostDto)
    } catch (error) {
      new HttpException("Can't update post", HttpStatus.BAD_REQUEST)
    }
  }

  public async delete(id: number): Promise<UpdateResult> {
    try {
      const post = await this._postRepository.findDetail(id)
      const postUpdate: UpdatePostDto = { 
        content: post.content, 
        description: post.description, 
        publish: post.publish, 
        publish_date: post.publish_date, 
        status: post.status, 
        thumbnail: post.thumbnail, 
        title: post.title, 
        is_deleted: true 
      }

      return await this._postRepository.updatePost(id, postUpdate)
      
    } catch (error) {
      new HttpException("Can't update post", HttpStatus.BAD_REQUEST)
    }
  };

}
