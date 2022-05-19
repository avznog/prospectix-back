import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Prospect } from './prospect.entity';

@Entity({ name: 'city' })
export class City extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  zipcode: number;

  @OneToMany(() => Prospect, (prospect) => prospect.city, { lazy: true })
  prospects: Prospect[];
}
