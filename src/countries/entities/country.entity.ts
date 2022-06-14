import { Prospect } from 'src/prospects/entities/prospect.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'country' })
export class Country extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Prospect, (prospect) => prospect.country, { lazy: true })
  prospects: Prospect[];
}
