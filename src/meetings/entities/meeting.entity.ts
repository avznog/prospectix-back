import { ProjectManager } from "src/project-managers/entities/project-manager.entity";
import { Prospect } from "src/prospects/entities/prospect.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Meeting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @ManyToOne(() => Prospect)
  prospect: Prospect;

  @ManyToOne(() => ProjectManager)
  pm: ProjectManager;
}