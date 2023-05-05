import { ApiProperty } from "@nestjs/swagger";
import { ProjectManager } from "src/users/project-managers/entities/project-manager.entity";
import { Prospect } from "src/prospect-global/prospects/entities/prospect.entity";
import { BaseEntity, Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class NegativeAnswer extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: "Id du refus",
    required: true
  })
  id: number;

  @Column()
  @ApiProperty({
    description: "Date du refus",
    required: true
  })
  date: Date;

  @ManyToOne(() => ProjectManager, (pm) => pm.negativeAnswers)
  @ApiProperty({
    description: "Project manager linked",
    required: true
  })
  pm: ProjectManager;

  @OneToOne(() => Prospect, (prospect) => prospect.negativeAnswer)
  prospect: Prospect;
}