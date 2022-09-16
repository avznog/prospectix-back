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
  @Column()
  totalCalls: number;

  @ApiProperty({
    description: "Nombre total de rappels",
    required: true
  })
  @Column()
  totalReminders: number;

  @ApiProperty({
    description: "Nombre total de rendez-vous",
    required: true
  })
  @Column()
  totalMeetings: number;

  @ApiProperty({
    description: "Nombre total d'emails",
    required: true
  })
  @Column()
  totalSentEmails: number;

  @ApiProperty({
    description: "Nombre total d'appels de la semaine",
    required: true
  })
  @Column()
  weeklyCalls: number;

  @ApiProperty({
    description: "Nombre total de rappels de la semaine",
    required: true
  })
  @Column()
  weeklyReminders: number;

  @ApiProperty({
    description: "Nombre total de rendez-vous de la semaine",
    required: true
  })
  @Column()
  weeklyMeetings: number;

  @ApiProperty({
    description: "Nombre total d'emails de la semaine",
    required: true
  })
  @Column()
  weeklySentEmails: number;
}
