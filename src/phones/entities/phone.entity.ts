import { Prospect } from 'src/prospects/entities/prospect.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'phone' })
export class Phone extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  number: string;

  @ManyToOne(() => Prospect)
  prospect: Prospect;
}
