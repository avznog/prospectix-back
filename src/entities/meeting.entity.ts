import { MeetingType } from 'src/constants/meeting.type';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CDP } from './cdp.entity';
import { Prospect } from './prospect.entity';

@Entity({ name: 'meeting' })
export class Meeting extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  type: MeetingType = MeetingType.TEL_VISIO;

  @Column()
  date: Date;

  @ManyToOne(() => CDP)
  cdp: CDP;

  @ManyToOne(() => Prospect)
  prospect: Prospect;
}
