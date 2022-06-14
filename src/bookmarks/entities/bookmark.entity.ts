import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Prospect } from 'src/prospects/entities/prospect.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'bookmark' })
export class Bookmark extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => ProjectManager)
  pm: ProjectManager;

  @ManyToOne(() => Prospect)
  prospect: Prospect;

  @Column()
  creationDate: Date;
}
