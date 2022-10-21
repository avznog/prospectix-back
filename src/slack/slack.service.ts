import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { lastDayOfWeek } from 'date-fns';
import previousMonday from 'date-fns/previousMonday';
import { Call } from 'src/calls/entities/call.entity';
import { Meeting } from 'src/meetings/entities/meeting.entity';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Prospect } from 'src/prospects/entities/prospect.entity';
import { Between, Repository } from 'typeorm';

@Injectable()
export class SlackService {

  webhookMeetingChannel: string;
  webhookFraudChannel: string;
  webhookChampChannel: string;
  webhookRecapChannel: string;

  constructor(
    private httpService: HttpService,

    @InjectRepository(ProjectManager)
    private readonly pmRepository: Repository<ProjectManager>,

    @InjectRepository(Call)
    private readonly callRepository: Repository<Call>,

    @InjectRepository(Meeting)
    private readonly meetingRepository: Repository<Meeting>
  ) {
    // ! changing the url for slack channel if prod / staging or localhost
    if(process.env.BASE_URL.includes("localhost")) {
      // ! LOCALHOST (= staging)
      this.webhookMeetingChannel = "https://hooks.slack.com/services/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"
      this.webhookFraudChannel = "https://hooks.slack.com/services/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"
      this.webhookChampChannel = "https://hooks.slack.com/services/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"
      this.webhookRecapChannel = "https://hooks.slack.com/services/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"
    } else if (process.env.BASE_URL.includes("staging")) {
      // ! STAGING
      this.webhookMeetingChannel = "https://hooks.slack.com/services/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"
      this.webhookFraudChannel = "https://hooks.slack.com/services/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"
      this.webhookChampChannel = "https://hooks.slack.com/services/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"
      this.webhookRecapChannel = "https://hooks.slack.com/services/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"
    } else {
      // ! PRODUCTION
      this.webhookMeetingChannel = "https://hooks.slack.com/services/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"
      this.webhookFraudChannel = "https://hooks.slack.com/services/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"
      this.webhookChampChannel = "https://hooks.slack.com/services/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"
      this.webhookRecapChannel = "https://hooks.slack.com/services/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"
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
  @Cron("00 17 * * 0")
  async sendWeekRecap() {
    try {
      let weekPms: [{ pm: ProjectManager, countCalls: number, countMeetings: number}] = [{pm: {} as ProjectManager, countCalls: 0, countMeetings: 0}];
      weekPms.pop();

      // ? for all pms (CDP)
      let pms = await this.pmRepository.find({
        where: {
          statsEnabled: true,
          disabled: false,
          admin: false,
        }
      });

      // ? DATES
      let end = new Date()
      let first = new Date();

      // ? start date : last sunday 17h02
      first.setDate(new Date().getDate() - 7)
      first.setHours(19,2,0,0)

      // ? end date -> the moment it starts with cron (every sunday, so sunday)
      end = new Date();



      // ? Loop in all pms
      for(let pm of pms) {

        // ? count calls of pm
        const countCalls = await this.callRepository.count({
          where: {
            pm: {
              pseudo: pm.pseudo
            },
            date: Between(new Date(first), new Date(end))
          }
        })

      // ? count meetings of pm
      const countMeetings = await this.meetingRepository.count({
          where: {
            pm: {
              pseudo: pm.pseudo
            },
            creationDate: Between(new Date(first), new Date(end))
          }
        })
        
        // ? if the pm did not complete the objectives
          if(countCalls < 50 && countMeetings == 0) {
            weekPms.push({
              pm: pm,
              countCalls: countCalls,
              countMeetings: countMeetings
            })
          }
        
      }

      // ? format message
      let content = "";
      weekPms.forEach(data => {
        content = content + `*${data.pm.firstname} ${data.pm.name}* n'a fait QUE ${data.countCalls} appels et ${data.countMeetings} rendez-vous\n>`
      })
      const message = {
        text: `:loading: :excuseme: Alerte aux faibles : \n>${content}`
      }

      // ? send
      return this.httpService.post(this.webhookRecapChannel, message).subscribe()
      
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible d'envoyer la notification du recap", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  } 

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
