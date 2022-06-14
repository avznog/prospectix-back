import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'goal' })
export class Goal extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  isCyclic: boolean;

  @Column()
  deadline: Date;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  totalSteps: number;

  @Column()
  currentStep: number;

  @ManyToOne(() => ProjectManager)
  projectManager: ProjectManager;
}
