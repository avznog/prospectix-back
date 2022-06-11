import { EventType } from 'src/constants/event.type';
import { Prospect } from 'src/entities/prospect.entity';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'event' })
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
