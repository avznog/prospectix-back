import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Prospect } from 'src/prospects/entities/prospect.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'reminder' })
export class Reminder extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => ProjectManager)
  pm: ProjectManager;

  @ManyToOne(() => Prospect)
  prospect: Prospect;

  @Column()
  description: string;

  @Column()
  priority: number;

  @Column()
  date: Date;
}
