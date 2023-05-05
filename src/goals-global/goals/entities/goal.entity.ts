import { ApiProperty } from "@nestjs/swagger";
import { GoalTemplate } from "src/goals-global/goal-templates/entities/goal-template.entity";
import { ProjectManager } from "src/users/project-managers/entities/project-manager.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Goal extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: "Id de l'objectif",
  })
  id: number;

  @ManyToOne(() => GoalTemplate)
  @ApiProperty({
    description: "Template de l'objectif"
  })
  goalTemplate: GoalTemplate;

  @Column({default: true})
  @ApiProperty({
    description: "Désactivation ou non de l'objectif template"
  })
  disabled: boolean;

  @Column({default: 0})
  @ApiProperty({
    description: "Valeur de l'objectif"
  })
  value: number;

  @ManyToOne(() => ProjectManager)
  @ApiProperty({
    description: "ProjectManager relié à l'objectif"
  })
  pm: ProjectManager;
}
