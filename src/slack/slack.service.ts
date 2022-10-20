import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Prospect } from 'src/prospects/entities/prospect.entity';

@Injectable()
export class SlackService {
  constructor(
    private httpService: HttpService
  ) {}

  sendMeetingProd(user: ProjectManager, prospect: Prospect) {
    try {
      return this.httpService.post("https://hooks.slack.com/services/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", { text: `👥 ${user.firstname} ${user.name} a décroché un rendez-vous avec ${prospect.companyName}`}).subscribe()
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible d'envoyer la notification de rendez-vous", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  sendMeetingStaging(user: ProjectManager, prospect: Prospect) {
    try {
      return this.httpService.post("https://hooks.slack.com/services/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", { text: `👥 ${user.firstname} ${user.name} a décroché un rendez-vous avec ${prospect.companyName}`}).subscribe()
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible d'envoyer la notification de rendez-vous", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  //  ? Cron tab every sunday
  @Cron("1 * * * * * ")
  sendResumeOfWeek() {
    try {
      return this.httpService.post("https://hooks.slack.com/services/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", { text: "[TEST] Message automatique d'envoi toutes les minutes à la @RespoJuif "}).subscribe()
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible d'envoyer la notification slack pour le résumé de la semaine du vendredi", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  } 
}
