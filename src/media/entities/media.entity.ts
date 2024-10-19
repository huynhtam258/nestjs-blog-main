import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinColumn, ManyToOne, JoinTable } from 'typeorm';

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

  @Column()
  image_id: string;

  @Column()
  is_deleted: boolean

  @ManyToMany(
    () => Product,
    product => product.medias,
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' },
  )
  products?: Product[];
}