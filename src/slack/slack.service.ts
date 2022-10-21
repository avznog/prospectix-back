import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Prospect } from 'src/prospects/entities/prospect.entity';

@Injectable()
export class SlackService {

  webhookMeetingChannel: string;
  webhookFraudChannel: string;
  webhookChampChannel: string;
  webhookRecapChannel: string;

  constructor(
    private httpService: HttpService,
  ) {
    // ! changing the url for slack channel if prod / staging or localhost
    if(process.env.BASE_URL.includes("localhost")) {
      // ! LOCALHOST (= staging)
      this.webhookMeetingChannel = "https://hooks.slack.com/services/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"
      this.webhookFraudChannel = "https://hooks.slack.com/services/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"
      this.webhookChampChannel = "https://hooks.slack.com/services/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"
    } else if (process.env.BASE_URL.includes("staging")) {
      // ! STAGING
      this.webhookMeetingChannel = "https://hooks.slack.com/services/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"
      this.webhookFraudChannel = "https://hooks.slack.com/services/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"
      this.webhookChampChannel = "https://hooks.slack.com/services/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"
    } else {
      // ! PRODUCTION
      this.webhookMeetingChannel = "https://hooks.slack.com/services/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"
      this.webhookFraudChannel = "https://hooks.slack.com/services/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"
      this.webhookChampChannel = "https://hooks.slack.com/services/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"
    }
  }

  sendMeetingSlack(user: ProjectManager, prospect: Prospect) {
    try {
      const message = {
        text: `👥 ${user.firstname} ${user.name} a décroché un rendez-vous avec ${prospect.companyName}`
      }
      return this.httpService.post(this.webhookMeetingChannel, message).subscribe()
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible d'envoyer la notification de rendez-vous", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  sendChampSlack(user: ProjectManager) {
    try {
      const message = {
        text: `🏆 Nouveau Champion ! ${user.firstname} ${user.name} a décroché son 3ème rendez-vous de la semaine`
      }
      return this.httpService.post(this.webhookChampChannel, message).subscribe()
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible d'envoyer la notification de champion", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  //  ? Cron tab every sunday
  // @Cron("1 * * * * * ")
  // sendResumeOfWeek() {
  //   try {
  //     return this.httpService.post("https://hooks.slack.com/services/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", { text: "[TEST] Message automatique d'envoi toutes les minutes à la @RespoJuif "}).subscribe()
  //   } catch (error) {
  //     console.log(error)
  //     throw new HttpException("Impossible d'envoyer la notification slack pour le résumé de la semaine du vendredi", HttpStatus.INTERNAL_SERVER_ERROR)
  //   }
  // } 


  // //  ? Cron tab every sunday
  // @Cron("00 17 * * 0")
  // slack() {
  //   console.log("Cron is working with " + new Date())
  // } 

  sendFraud(prospect: Prospect, user: ProjectManager) {
    try {
      const message = {
        text: `🚨🚨🚨 Alerte ! Nous avons un fraudeur : *${user.firstname} ${user.name}* a appelé ${prospect.companyName} aujourd'hui à *${(new Date().toLocaleTimeString())}*`
      }
      return this.httpService.post(this.webhookFraudChannel, message).subscribe()
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible d'envoyer la notification", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
