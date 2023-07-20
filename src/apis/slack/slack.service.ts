import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectManager } from 'src/users/project-managers/entities/project-manager.entity';
import { Prospect } from 'src/prospect-global/prospects/entities/prospect.entity';
import { Reminder } from 'src/actions/reminders/entities/reminder.entity';
import { Between, Repository } from 'typeorm';
import { UsersListResponse, WebClient } from '@slack/web-api';
import { CallsService } from 'src/actions/calls/calls.service';
import { MeetingsService } from 'src/actions/meetings/meetings.service';
const fs = require('fs');

@Injectable()
export class SlackService {

  webhookMeetingChannel: string;
  webhookFraudChannel: string;
  webhookChampChannel: string;
  webhookRecapChannel: string;
  environment: string = "";
  client: WebClient;
  constructor(
    private httpService: HttpService,

    @InjectRepository(ProjectManager)
    private readonly pmRepository: Repository<ProjectManager>,
    
    @InjectRepository(Reminder)
    private readonly reminderRepository: Repository<Reminder>,

    private readonly callsService: CallsService,
    private readonly meetingsService: MeetingsService
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

    // ! Slack client tokens & initialization
    // ! IF PROSPECTIX IS IN DEV OR STAGING -> SENDING MESSAGES TO SLACK ADMIN
    if (this.environment == "prod") {
      // ? CLIENT CDP -> SLACK CDP 
      this.client = new WebClient("xoxb-451848388199-4265120570036-30Z0d4NI04Bo2Cb7wGtPsHFF");
    } else {
      // ? CLIENT ADMIN -> SLACK ADMIN
      this.client = new WebClient("xoxb-358133606565-4230355888689-V1oyyJKt2LgKGIKDS3AWx7dH");
    }
  }

  sendChampSlack(user: ProjectManager) {
    try {
      const message = {
        text: `🏆 Nouveau Champion ! ${user.firstname} ${user.name} a décroché son 3ème rendez-vous de la semaine`
      }
      // return this.httpService.post(this.webhookChampChannel, message).subscribe()
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible d'envoyer la notification de champion", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  //  ? Cron tab every sunday
  // @Cron("00 17 * * 0")
  // ? updated by Gauthier Itart-Longueville, 07 82 09 43 77, allez le dm
  async sendWeekRecap() {
    try {
      const allCallsCounted = await this.callsService.countWeeklyAll();
      const allMeetingsCounted = await this.meetingsService.countWeeklyAll();
      let pmsObjectived = await this.pmRepository.find({
        relations: ["goals", "goals.goalTemplate"],
        where: {
          objectived: true
        }
      });
      pmsObjectived = pmsObjectived.filter(pm => pm.objectived)
      let contentBadCdP = '';
      let contentGoodCdP = '';
      allCallsCounted.forEach(callCounted => {
        const currentPm = pmsObjectived.find(pm => pm.id == callCounted.id)
        const meetingCounted = allMeetingsCounted.find(meetingC => meetingC.id == callCounted.id);
        const callsGoalValue = currentPm.goals.find(goal => goal.goalTemplate.name == 'Appels').value
        const meetingsGoalValue = currentPm.goals.find(goal => goal.goalTemplate.name == 'Rendez-vous').value
        if(callCounted.count < callsGoalValue || meetingCounted.count < meetingsGoalValue ) {
          contentBadCdP += `• *${currentPm.firstname} ${currentPm.name}* : *${callCounted.count} / ${callsGoalValue}* Appels et *${meetingCounted.count} / ${meetingsGoalValue}* Rendez-vous\n>`
        }
        else {
          contentGoodCdP += `• *${currentPm.firstname} ${currentPm.name}* : *${callCounted.count} / ${callsGoalValue}* Appels et *${meetingCounted.count} / ${meetingsGoalValue}* Rendez-vous\n>`
        }
      })
      const message = {
        text: ` \n :loading: :excuseme: ALERTE AUX FAIBLES : \n>${contentBadCdP} \n> \n\n :champagne-shower: LES CHAMPIONS DE LA SEMAINE : \n>${contentGoodCdP}\n \n\n\n>`
      }
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
      // return this.httpService.post(this.webhookFraudChannel, message).subscribe()
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible d'envoyer la notification", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ! TO CHANGE TO EVERY 5 mn
  // @Cron('*/5 * * * *')
  async getSlackUsers() {
    try {
      // ? get list of users from slack 
      const users = await this.client.users.list();

      // ? write in a json file
      fs.writeFileSync('slackUsers.json', JSON.stringify(users));
      return users;
    } catch (error) {
      console.log(error)
      throw new Error('Failed recovering slack api users');
    }
      
  }
  // ! CRON WORKING EVERY MINUTES, CHECKING IF U HAVE A REMINDER IN 3 H -> then send slack message
  // @Cron("* * * * *")
  async sendPmReminder() {
    try {

      // ? getting the list of slack users from the file / calling method to read the file
      let slackUsers: UsersListResponse;
      if(!fs.existsSync("slackUsers.json")) {
        slackUsers = await this.getSlackUsers();
      } else {
        slackUsers = JSON.parse(fs.readFileSync('slackUsers.json'));
      }

      // ? getting all the pms that are cdp
      let pms = await this.pmRepository.find({
        where: {
          admin: false,
          statsEnabled: true,
          disabled: false
        }
      });
  
      // ?  if cron starts at 17:23:22 -> Between(17:23:00, 17:24:00)
      
      // ? interval of dates, scanning the reminders 30 mns later than the cron
      const intervalDown = new Date(new Date().setHours(new Date().getHours(), new Date().getMinutes() + 30, 0, 0));
      const intervalUp = new Date(new Date().setHours(new Date().getHours(), new Date().getMinutes() + 30, 59, 999))

      
      // * for each pm, check if exists on slack, and then check if he has a reminder in the same minute 3mn later. If yes, send notif
      pms.forEach(async pm => {

        // ? getting current pm from the slack users
        const member = slackUsers.members.find(mem => mem.name == pm.pseudo);
        if (member) {
          
          // ? getting pm's reminders, bewteen the dates of then interval (30 mn laters)
          const reminders = await this.reminderRepository.find({
            where: {
              pm: {
                pseudo: pm.pseudo
              },
              date: Between(intervalDown, intervalUp)
            },
            relations: ["prospect","prospect.phone"]
          });

          // ? for each reminder, send a slack notification
          reminders.forEach(reminder => {
            this.client.chat.postMessage({
              channel: member.id,
                  text: `Tu as un rappel à ${intervalDown.getHours()}:${intervalDown.getMinutes()} avec ${reminder.prospect.companyName} au <tel:${reminder.prospect.phone.number}|${reminder.prospect.phone.number}>`
            })
          });
        }
      });
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible d'envoyer la notification personnalisée au chef de projet pour les rappels", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
