import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Prospect } from 'src/prospects/entities/prospect.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'reminder' })
export class Reminder {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => ProjectManager)
  projectManager: ProjectManager;

  @ManyToOne(() => Prospect)
  prospect: Prospect;

  @Column()
  description: string;

  @Column()
  priority: number;

  @Column()
  date: Date;
}
