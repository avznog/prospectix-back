import { MeetingType } from 'src/constants/meeting.type';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Prospect } from 'src/prospects/entities/prospect.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'meeting' })
export class Meeting {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  type: MeetingType = MeetingType.TEL_VISIO;

  @Column()
  date: Date;

  @ManyToOne(() => ProjectManager)
  projectManager: ProjectManager;

  @ManyToOne(() => Prospect)
  prospect: Prospect;
}
