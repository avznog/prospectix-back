import { ApiProperty } from "@nestjs/swagger";
import { ProjectManager } from "src/project-managers/entities/project-manager.entity";
import { BaseEntity, Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Statistic extends BaseEntity {

  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: "L'id de la statistique",
    required: true
  })
  id: number

  
  @OneToOne(() => ProjectManager, (pm) => pm.statistic)
  pm: ProjectManager;

  @ApiProperty({
    description: "Nombre total d'appels",
    required: true
  })
  @Column({ nullable: true })
  totalCalls: number;

  @ApiProperty({
    description: "Nombre total de rappels",
    required: true
  })
  @Column({ nullable: true })
  totalReminders: number;

  @ApiProperty({
    description: "Nombre total de rendez-vous",
    required: true
  })
  @Column({ nullable: true })
  totalMeetings: number;

  @ApiProperty({
    description: "Nombre total d'emails",
    required: true
  })
  @Column({ nullable: true })
  totalSentEmails: number;

  @Column({ nullable: true })
  @ApiProperty({
    description: "Nombre total de refus",
    required: true
  })
  totalNegativeAnswers: number;

  @ApiProperty({
    description: "Nombre total d'appels de la semaine",
    required: true
  })
  @Column({ nullable: true })
  weeklyCalls: number;

  @ApiProperty({
    description: "Nombre total de rappels de la semaine",
    required: true
  })
  @Column({ nullable: true })
  weeklyReminders: number;

  @ApiProperty({
    description: "Nombre total de rendez-vous de la semaine",
    required: true
  })
  @Column({ nullable: true })
  weeklyMeetings: number;

  @ApiProperty({
    description: "Nombre total d'emails de la semaine",
    required: true
  })
  @Column({ nullable: true })
  weeklySentEmails: number;

  @Column({ nullable: true })
  @ApiProperty({
    description: "Nombre total de refus de la semaine",
    required: true
  })
  weeklyNegativeAnswers: number;
}
