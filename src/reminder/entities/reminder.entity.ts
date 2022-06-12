import { ProjectManager } from "src/project-manager/entities/project-manager.entity";
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

  // @Column()
  // date: Date;

  @ManyToOne(() => ProjectManager)
  pm: ProjectManager;

}
