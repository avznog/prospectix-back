import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CDP } from './cdp.entity';
import { Prospect } from './prospect.entity';

@Entity({ name: 'bookmark' })
export class Bookmark extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => CDP)
  cdp: CDP;

  @ManyToOne(() => Prospect)
  prospect: Prospect;

  @Column()
  creationDate: Date;
}
