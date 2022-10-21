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

  sendMeetingSlack(user: ProjectManager, prospect: Prospect) {
    try {
      const message = {
        text: `👥 ${user.firstname} ${user.name} a décroché un rendez-vous avec ${prospect.companyName}`
      }
      let url;

      // ! changing the url for slack channel if prod / staging or localhost
      if(process.env.BASE_URL.includes("localhost")) {
        url = "https://hooks.slack.com/services/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"
      } else if (process.env.BASE_URL.includes("staging")) {
        url = "https://hooks.slack.com/services/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"
      } else {
        url = "https://hooks.slack.com/services/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"
      }
      return this.httpService.post(url, message).subscribe()
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible d'envoyer la notification de rendez-vous", HttpStatus.INTERNAL_SERVER_ERROR)
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

  sendCheatingSlack() {
    try {
      const message = {
        text: ""
      }
      return this.httpService.post("", message).subscribe()
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible d'envoyer la notification", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
