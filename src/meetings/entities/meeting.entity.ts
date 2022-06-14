import { MeetingType } from 'src/constants/meeting.type';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Prospect } from 'src/prospects/entities/prospect.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'meeting' })
export class Meeting extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  type: MeetingType = MeetingType.TEL_VISIO;

  @Column()
  date: Date;

  @ManyToOne(() => ProjectManager)
  pm: ProjectManager;

  @ManyToOne(() => Prospect)
  prospect: Prospect;
}
