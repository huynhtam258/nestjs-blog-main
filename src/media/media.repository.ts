import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
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

  async createMedia(userId: number, media_url: string ): Promise<MediaEntity> {
    const user = await this.userRepository.findOneBy({ id: userId })

    if (!user) {
      throw new HttpException("Can't find user", HttpStatus.BAD_REQUEST)
    }

    const media = await this.save({ media_type: 'IMAGE', media_url })
    return media
  }

  async findAllMediaByUserId(userId: number) {
    const result = await this.find({
      where: {
        user: {
          id: userId
        }
      }
    })

    return result || []
  }
}