import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Prospect } from 'src/prospects/entities/prospect.entity';

@Injectable()
export class SlackService {
  constructor(
    private httpService: HttpService
  ) {}

  async sendMeetingProd(user: ProjectManager, prospect: Prospect) {
    try {
      return this.httpService.post("https://hooks.slack.com/services/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", { text: `👥 ${user.firstname} ${user.name} a décroché un rendez-vous avec ${prospect.companyName}`}).subscribe()
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible d'envoyer la notification de rendez-vous", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async sendMeetingStaging(user: ProjectManager, prospect: Prospect) {
    try {
      return this.httpService.post("https://hooks.slack.com/services/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", { text: `👥 ${user.firstname} ${user.name} a décroché un rendez-vous avec ${prospect.companyName}`}).subscribe()
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible d'envoyer la notification de rendez-vous", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
