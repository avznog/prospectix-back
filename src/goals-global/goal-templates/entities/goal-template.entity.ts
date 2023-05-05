import { ApiProperty } from "@nestjs/swagger";
import { Goal } from "src/goals-global/goals/entities/goal.entity";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class GoalTemplate extends BaseEntity {

  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: "Id de l'objectif template",
  })
  id: number;

  @OneToMany(() => Goal, (goal) => goal.goalTemplate)
  @ApiProperty({
    description: "Template de l'objectif"
  })
  goals: Goal[];

  @Column({default: ""})
  @ApiProperty({
    description: "Nom de l'objectif template"
  })
  name: string;

  @Column({default: ""})
  @ApiProperty({
    description: "Description de l'objectif template"
  })
  description: string;

  @Column({ default: false })
  @ApiProperty({
    description: "Désactivation ou non de l'objectif template"
  })
  disabled: boolean;

  @Column({ default: 0 })
  @ApiProperty({
    description: "Valeur par défaut de l'objectif template"
  })
  default: number;
}
