import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Call } from 'src/calls/entities/call.entity';
import { Meeting } from 'src/meetings/entities/meeting.entity';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Prospect } from 'src/prospects/entities/prospect.entity';
import { Reminder } from 'src/reminders/entities/reminder.entity';
import { Between, Repository } from 'typeorm';
const { WebClient } = require("@slack/web-api");

@Injectable()
export class SlackService {

  webhookMeetingChannel: string;
  webhookFraudChannel: string;
  webhookChampChannel: string;
  webhookRecapChannel: string;
  environment: string = "";

  constructor(
    private httpService: HttpService,

    @InjectRepository(ProjectManager)
    private readonly pmRepository: Repository<ProjectManager>,

    @InjectRepository(Call)
    private readonly callRepository: Repository<Call>,

    @InjectRepository(Meeting)
    private readonly meetingRepository: Repository<Meeting>,
    
    @InjectRepository(Reminder)
    private readonly reminderRepository: Repository<Reminder>
  ) {
    // ! changing the url for slack channel if prod / staging or localhost
    if (process.env.BASE_URL.includes("localhost")) {
      this.environment = "dev"
      // ! LOCALHOST (= staging)
      this.webhookFraudChannel = "https://hooks.slack.com/services/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"
      this.webhookChampChannel = "https://hooks.slack.com/services/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"
      this.webhookRecapChannel = "https://hooks.slack.com/services/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"
    } else if (process.env.BASE_URL.includes("staging")) {
      this.environment = "staging"
      // ! STAGING
      this.webhookFraudChannel = "https://hooks.slack.com/services/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"
      this.webhookChampChannel = "https://hooks.slack.com/services/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"
      this.webhookRecapChannel = "https://hooks.slack.com/services/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"
    } else {
      this.environment = "prod"
      // ! PRODUCTION
      this.webhookFraudChannel = "https://hooks.slack.com/services/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"
      this.webhookChampChannel = "https://hooks.slack.com/services/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"
      this.webhookRecapChannel = "https://hooks.slack.com/services/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"
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
      let weekPms: [{ pm: ProjectManager, countCalls: number, countMeetings: number }] = [{ pm: {} as ProjectManager, countCalls: 0, countMeetings: 0 }];
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
      first.setHours(19, 2, 0, 0)

      // ? end date -> the moment it starts with cron (every sunday, so sunday)
      end = new Date();



      // ? Loop in all pms
      for (let pm of pms) {

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
        if (countCalls < 50 && countMeetings == 0) {
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

  // ! CRON WORKING EVERY MINUTES, CHECKING IF U HAVE A REMINDER IN 3 H -> then send slack message
  @Cron("* * * * *")
  async sendPmReminder() {
    try {
      console.log("working on " + new Date().toISOString())
      // ! IF PROSPECTIX IS IN DEV OR STAGING -> SENDING MESSAGES TO SLACK ADMIN
      let client = new WebClient();
      if (this.environment == "prod") {
        // ? CLIENT CDP -> SLACK CDP 
        client = new WebClient("xoxb-451848388199-4265120570036-30Z0d4NI04Bo2Cb7wGtPsHFF");
      } else {
        // ? CLIENT ADMIN -> SLACK ADMIN
        client = new WebClient("xoxb-358133606565-4230355888689-V1oyyJKt2LgKGIKDS3AWx7dH");
      }

      // * getting all the users of slack
      const result = await client.users.list();

      // * getting all the pms that are cdp
      let pms = await this.pmRepository.find({
        where: {
          admin: false,
          statsEnabled: true,
          disabled: false
        }
      });

      // ?  if cron starts at 17:23:22 -> Between(17:23:00, 17:24:00)
      // !  dates on local are not in french time zone (+5 because of utc 2)
      const beginningInterval3h = new Date(new Date().setHours(new Date().getHours() + 3, new Date().getMinutes(), 0, 0));
      const endInterval3h = new Date(new Date().setHours(new Date().getHours() + 3, new Date().getMinutes(), 59, 999))

      // * for each pm, check if exists on slack, and then check if he has a reminder in the same minute 3 hours later. If yes, send notif
      pms.forEach(async pm => {
        if (result.members.find(member => member.name == pm.pseudo)) {
          const slackUser = result.members.find(member => member.name == pm.pseudo)
          console.log(beginningInterval3h, endInterval3h)
          await this.reminderRepository.findAndCount({
            relations: ["prospect", "prospect.phone"],
            where: {
              pm: {
                pseudo: pm.pseudo
              },
              // ? between minute down and minute up
              date: Between(beginningInterval3h, endInterval3h)
            }
          }).then(remindersCounted => {
            if (remindersCounted[1] > 0) {
              for (let reminder of remindersCounted[0]) {
                client.chat.postMessage({
                  channel: slackUser.id,
                  text: `Tu as un rappel à ${beginningInterval3h.getHours()}:${beginningInterval3h.getMinutes()} avec ${reminder.prospect.companyName} au <tel:${reminder.prospect.phone.number}|${reminder.prospect.phone.number}>`
                })
              }
            }

          })
        }
      })
      return result
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible d'envoyer la notification personnalisée au chef de projet pour les rappels", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
