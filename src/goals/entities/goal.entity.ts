import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'goal' })
export class Goal {
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
  achievementTotalSteps: number;

  @Column()
  currentAchievement: number;

  @ManyToOne(() => ProjectManager)
  projectManager: ProjectManager;
}
