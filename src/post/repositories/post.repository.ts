import { DataSource, Like, Repository, UpdateResult } from "typeorm";
import { Post as PostEntity } from "../entities/post.entity";
import { CreatePostDto } from "../dto/create-post.dto";
import { User as UserEntity } from "src/user/entities/user.entity";
import { Injectable } from "@nestjs/common";
import { UpdatePostDto } from "../dto/update-post.dto";
import { FilterPostDto } from "../dto/filter-post.dto";
import { Pagination } from "src/core/interfaces/pagination.interface";

@Injectable()
export class PostRepository extends Repository<PostEntity> {
  constructor(dataSource: DataSource) {
    super(PostEntity, dataSource.createEntityManager())
  }

  async createPost(createPostDto: CreatePostDto, user: UserEntity) {
    const post = await this.save({
      ...createPostDto,
      publish: false,
      is_deleted: false,
      user
    })
    return post
  }

  async findAllPost(query: FilterPostDto): Promise<Pagination<PostEntity[]>> {
    const items_per_page = Number(query.items_per_page) || 10;
    const page = Number(query.page) || 1;
    const search = query.search || '';
    const category = Number(query.category) || null;

    const skip = (page - 1) * items_per_page;

    const [res, total] = await this.findAndCount({
      where: {
        title: Like('%' + search + '%'),
        description: Like('%' + search + '%'),
        is_deleted: false
      },
      order: { created_at: 'DESC' },
      take: items_per_page,
      skip: skip,
      relations: {
        user: true
      },
      select: {
        content: false,
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

  async findDetail(postId: number): Promise<PostEntity>{
    return await this.findOne({
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

  async updatePost(postId: number, updatePostDto: UpdatePostDto): Promise<UpdateResult> {
    return await this.update(postId, updatePostDto)
  }

  async deletePost(postId: number) {
    return await this.delete(postId);
  }
}