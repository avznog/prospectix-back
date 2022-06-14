import { EventType } from 'src/constants/event.type';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Prospect } from 'src/prospects/entities/prospect.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'events' })
export class Event extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => ProjectManager)
  projectManager: ProjectManager;

  @ManyToOne(() => Prospect)
  prospect: Prospect;

  @Column()
  event: EventType;

  @Column()
  creationDate: Date;
}
