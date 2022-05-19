import { EventType } from 'src/constants/event.type';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CDP } from './cdp.entity';
import { Prospect } from './prospect.entity';

@Entity({ name: 'event' })
export class Event extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => CDP)
  cdp: CDP;

  @ManyToOne(() => Prospect)
  prospect: Prospect;

  @Column()
  event: EventType;

  @Column()
  creationDate: Date;
}
