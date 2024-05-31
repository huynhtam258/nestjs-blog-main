import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/user/entities/user.entity";

export type MediaType = 'IMAGE'

@Entity()
export class Media {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, user => user.carts)
  @JoinColumn()
  user: User;

  @Column()
  media_url: string;

  @Column({
    type: 'enum',
    enum: ['IMAGE'],
  })
  media_type: MediaType
}