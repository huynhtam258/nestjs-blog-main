import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { DataSource, Repository, UpdateResult } from "typeorm";
import { Media as MediaEntity } from 'src/media/entities/media.entity'
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/entities/user.entity";

@Injectable()
export class MediaRepository extends Repository<MediaEntity> {
  constructor (
    dataSource: DataSource,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {
    super(MediaEntity, dataSource.createEntityManager())
  }

  async createMedia(userId: number, media_url: string, image_id: string): Promise<MediaEntity> {
    const user = await this.userRepository.findOneBy({ id: userId })

    if (!user) {
      throw new HttpException("Can't find user", HttpStatus.BAD_REQUEST)
    }

    const media = await this.save({ userId: userId ,media_type: 'IMAGE', media_url, image_id, is_deleted: false })
    return media
  }

  async deleteMedia(imageId: string): Promise<UpdateResult> {
    const image = await this.findOne({
      where: {
        image_id: imageId
      }
    })
    const media = this.update(image.id, { ...image, is_deleted: true})
    return media
  }

  async findAllMediaByUserId(userId: number) {
    const result = await this.find({
      where: {
        user: {
          id: userId
        },
        is_deleted: false
      }
    })

    return result || []
  }
}