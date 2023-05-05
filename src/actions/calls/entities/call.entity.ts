import { ApiProperty } from "@nestjs/swagger";
import { ProjectManager } from "src/users/project-managers/entities/project-manager.entity";
import { Prospect } from "src/prospect-global/prospects/entities/prospect.entity";
import { BaseEntity, Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Call extends BaseEntity {

  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: "Id de l'appel",
    required: true
  })
  id: number

  @Column()
  @ApiProperty({
    description: "Date de l'appel",
    required: true
  })
  date: Date;

  @ManyToOne(() => ProjectManager, (pm) => pm.calls)
  @ApiProperty({
    description: "Project manager linked",
    required: true
  })
  pm: ProjectManager;

  @OneToOne(() => Prospect, (prospect) => prospect.call)
  prospect: Prospect;
}
