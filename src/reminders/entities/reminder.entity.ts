import { ProjectManager } from "src/project-managers/entities/project-manager.entity";
import { Prospect } from "src/prospects/entities/prospect.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Reminder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  description: string;

  @Column()
  priority: number;

  @Column()
  date: Date;

  @ManyToOne(() => ProjectManager)
  pm: ProjectManager;

  @ManyToOne(() => Prospect)
  prospect: Prospect;
}
