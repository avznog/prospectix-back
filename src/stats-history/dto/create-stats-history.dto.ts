import { ApiProperty } from "@nestjs/swagger";
import { ProjectManager } from "src/project-managers/entities/project-manager.entity";

export class CreateStatsHistoryDto {

  @ApiProperty({
    description: "Chef de projet à qui appartient la ligne de statistiques",
    required: true
  })
  pm: ProjectManager;

  @ApiProperty({
    description: "Nombre total d'appels",
    required: true
  })
  totalCalls: number;

  @ApiProperty({
    description: "Nombre total de rappels",
    required: true
  })
  totalReminders: number;

  @ApiProperty({
    description: "Nombre total de rendez-vous",
    required: true
  })
  totalMeetings: number;

  @ApiProperty({
    description: "Nombre total d'emails",
    required: true
  })
  totalSentEmails: number;

  @ApiProperty({
    description: "Nombre total de refus",
    required: true
  })
  totalNegativeAnswers: number;

  @ApiProperty({
    description: "Nombre total d'appels de la semaine",
    required: true
  })
  weeklyCalls: number;

  @ApiProperty({
    description: "Nombre total de rappels de la semaine",
    required: true
  })
  weeklyReminders: number;

  @ApiProperty({
    description: "Nombre total de rendez-vous de la semaine",
    required: true
  })
  weeklyMeetings: number;

  @ApiProperty({
    description: "Nombre total d'emails de la semaine",
    required: true
  })
  weeklySentEmails: number;

  @ApiProperty({
    description: "Nombre total de refus de la semaine",
    required: true
  })
  weeklyNegativeAnswers: number;

  @ApiProperty({
    description: "Date de début de la période de stats",
    required: false
  })
  startDate: Date;

  @ApiProperty({
    description: "Date de fin de la période de stats",
    required: false
  })
  endDate: Date;
}
