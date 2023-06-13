import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { lastDayOfWeek } from 'date-fns';
import moment from 'moment';
import { CreateSentEmailDto } from 'src/actions/sent-emails/dto/create-sent-email.dto';
import { SentEmail } from 'src/actions/sent-emails/entities/sent-email.entity';
import { GoogleService } from 'src/apis/google/google.service';
import { StageType } from 'src/constants/stage.type';
import { MailTemplate } from 'src/mails/mail-templates/entities/mail-template.entity';
import { PrimaryActivityService } from 'src/prospect-global/activities/primary-activities/primary-activity.service';
import { SecondaryActivitiesService } from 'src/prospect-global/activities/secondary-activities/secondary-activities.service';
import { Prospect } from 'src/prospect-global/prospects/entities/prospect.entity';
import { ProjectManager } from 'src/users/project-managers/entities/project-manager.entity';
import { Between, ILike, Not, Repository, UpdateResult } from 'typeorm';
import { ResearchParamsSentEmailsDto } from './dto/research-params-sent-emails.dto';
import { SendEmailDto } from './dto/send-email.dto';

@Injectable()
export class SentEmailsService {

  constructor(
    @InjectRepository(SentEmail)
    private readonly sentEmailRepository: Repository<SentEmail>,

    @InjectRepository(ProjectManager)
    private readonly pmRepository: Repository<ProjectManager>,

    @InjectRepository(Prospect)
    private readonly prospectRepository: Repository<Prospect>,

    @InjectRepository(MailTemplate)
    private readonly mailTemplateRepository: Repository<MailTemplate>,

    private readonly googleService: GoogleService,
    private readonly secondaryActivitiesService: SecondaryActivitiesService,
    private readonly primaryActivitiesService: PrimaryActivityService
  ) { }

  async findAllPaginated(researchParamsSentEmailsDto: ResearchParamsSentEmailsDto, user: ProjectManager) : Promise<{sentEmails: SentEmail[], count: number}> {
    try {
      const sent = researchParamsSentEmailsDto.sent == 1 ? true : false;
      await this.checkMailsSynchro();
      const sentEmails = await this.sentEmailRepository.findAndCount({
        relations: ["pm", "prospect", "prospect.secondaryActivity", "prospect.secondaryActivity.primaryActivity", "prospect.city", "prospect.country", "prospect.phone", "prospect.email", "prospect.website", "prospect.reminders", "prospect.meetings", "prospect.events", "prospect.bookmarks"],
        where: 
        // ? only keyword
        researchParamsSentEmailsDto.keyword && [
          {
            prospect: {
              stage: !sent ? StageType.MAIL : StageType.MAIL_SENT,
              companyName: ILike(`%${researchParamsSentEmailsDto.keyword}%`)
            },
            pm: {
              pseudo: user.pseudo
            },
            sent: sent
          },
          {
            prospect: {
              stage: !sent ? StageType.MAIL : StageType.MAIL_SENT,
              phone: {
                number: ILike(`${researchParamsSentEmailsDto.keyword}`)
              }
            },
            pm: {
              pseudo: user.pseudo
            },
            sent: sent
          },
        ] || 
        // ? no params
        [
          {
            prospect: {
              stage: !sent ? StageType.MAIL : StageType.MAIL_SENT
            },
            pm: {
              pseudo: user.pseudo
            },
            sent: sent
          }
        ]
        ,
        order: {
          sendingDate: "ASC"
        },
        take: researchParamsSentEmailsDto.take,
        skip: researchParamsSentEmailsDto.skip
      })

      return {
        sentEmails: sentEmails[0],
        count: sentEmails[1]
      };
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de récupérer les emails non envoyés", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async markSent(idSentEmail: number, templateName: string, object: string): Promise<UpdateResult> {
    try {
      return await this.sentEmailRepository.update(idSentEmail, { sent: true, sendingDate: moment().tz('Europe/Paris').toDate(), templateName: templateName, object: object });
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de marquer l'email comme envoyé", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ! important -> when merging on the first time, due to the old database -> there will be only one  date for the sentEmail (the sendingDate)
  // ! thus, I check for every prospect, if the sending date exists but not the date AND the the prospect is un stage 4 (mail), I change the stage to 8 and set the date to the same as sendingdDate
  async checkMailsSynchro() {
    try {
      let sentEmails = await this.sentEmailRepository.find({
        relations: ["prospect"],
      });
      for (let sentEmail of sentEmails) {
        if (!sentEmail.date) {
          this.sentEmailRepository.update(sentEmail.id, { date: sentEmail.sendingDate, sent: true })
          if (sentEmail.prospect.stage == 4) {
            this.prospectRepository.update(sentEmail.prospect.id, { stage: 8 })
          }
        }
      }
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de vérifier les dates des emails envoyés", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async create(createSentEmailDto: CreateSentEmailDto, user: ProjectManager): Promise<SentEmail> {
    try {
      createSentEmailDto.date = moment(createSentEmailDto.date).tz('Europe/Paris').toDate();
      if(createSentEmailDto.sendingDate) {
        createSentEmailDto.sendingDate = moment(createSentEmailDto.sendingDate).tz('Europe/Paris').toDate();
      }
      createSentEmailDto.pm = user;
      this.secondaryActivitiesService.adjustWeight(createSentEmailDto.prospect.secondaryActivity.id, 0.09)
      this.primaryActivitiesService.adjustWeight(createSentEmailDto.prospect.secondaryActivity.primaryActivity.id, 0.09)
      return await this.sentEmailRepository.save(createSentEmailDto);
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de créer l'email", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async countWeeklyForMe(user: ProjectManager): Promise<number> {
    try {
      const today = new Date();
      const firstd = today.getDate() - today.getDay() + 1;

      //  ? getting the monday of the week
      const monday = new Date(today.setDate(firstd));

      // ? getting the sunday of the week
      const sunday = lastDayOfWeek(new Date(), { weekStartsOn: 1})

      // ? setting monday on midnight and sunday on 23:59:59
      monday.setHours(1, 0, 0, 0)
      sunday.setHours(24, 59, 59, 999)

      return await this.sentEmailRepository.count({
        where: {
          pm: {
            pseudo: user.pseudo
          },
          date: Between(monday, sunday)
        }
      })
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de récupérer les appels de la derniere semaine", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async countAllForMe(user: ProjectManager): Promise<number> {
    try {
      return await this.sentEmailRepository.count({
        where: {
          pm: {
            id: user.id
          }
        }
      });
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de compter les mails", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async countAll(interval: { dateDown: Date, dateUp: Date }) {
    try {
      let results: [{}] = [{}];
      results.pop();
      await this.pmRepository.find({
        relations: ["sentEmails"],
        where: {
          statsEnabled: true
        }
      }).then(pms => {
        pms.forEach(pm => {
          let count = 0;

          pm.sentEmails.length && pm.sentEmails.forEach(sentEmail => {
            if (new Date(interval.dateDown) < new Date(sentEmail.date) && new Date(sentEmail.date) < new Date(interval.dateUp)) {
              count += 1;
            }
          })
          results.push({
            pseudo: pm.pseudo,
            count: count
          });
        })
      });
      return results
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de compter les emails envoyés", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async countAllByWeeksForMe(user: ProjectManager) {
    try {
      let results: { intervals: [{ dateDown: Date, dateUp: Date }], data: [number] } = { intervals: [{ dateDown: new Date, dateUp: new Date }], data: [0] };
      results.data.pop();
      results.intervals.pop();

      //  ! begining of history
      let s = new Date("2022-11-07")
      let temp = new Date("2022-11-07")

      // ! end of history
      let ed = new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 1 + 6));
      while (s <= ed) {

        // ! each week sunday
        temp.setDate(temp.getDate() + 7)
        results.intervals.push({
          dateDown: new Date(s),
          dateUp: new Date(temp.setHours(0, 59, 59, 999))
        });
        const count = await this.sentEmailRepository.count({
          where: {
            pm: {
              pseudo: user.pseudo
            },
            date: Between(s, new Date(temp.setHours(0, 59, 59, 999)))
          }
        })
        results.data.push(count)
        s.setDate(s.getDate() + 7)
      }
      return results
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de compter les appels par semaines", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async send(sendEmailDto: SendEmailDto, pm: ProjectManager, idSentEmail: number) {
    try {
      const mailTemplate = await this.mailTemplateRepository.findOne({
        where: {
          id: sendEmailDto.mailTemplateId
        }
      });
      if(sendEmailDto.mailTemplateModified) {
        mailTemplate.content = sendEmailDto.mailTemplateModified;
      }
      
      // ? sending the email
      await this.googleService.sendMail(sendEmailDto, mailTemplate, pm)

      // ? marking the email as sent
      idSentEmail != -1 && await this.markSent(idSentEmail, mailTemplate.name, sendEmailDto.object);
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible d'envoyer le mail", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async sendSeparately(idSentEmail: number, object: string) {
    try {
      return await this.sentEmailRepository.update(idSentEmail, { sent: true, sendingDate: moment().tz('Europe/Paris').toDate(), templateName: "Envoyé séparément", object: object });
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de marquer le mail comme envoyé séparément", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async createAndSendSeparately(createSendEmailDto: CreateSentEmailDto, user: ProjectManager, object: string) {
    try {
      const sentEmail = await this.create(createSendEmailDto, user);
      this.sendSeparately(sentEmail.id, object);
      return await this.sentEmailRepository.findOne({where: { id: sentEmail.id }, relations: ["prospect", "prospect.secondaryActivity", "prospect.secondaryActivity.primaryActivity", "prospect.city", "prospect.phone", "prospect.country","prospect.email", "prospect.website"]});
    } catch (error) {
      console.log(error)
      throw new HttpException("Failed to send", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async createAndSend(createSentEmailDto: CreateSentEmailDto, user: ProjectManager, sendEmailDto: SendEmailDto) : Promise<SentEmail> {
    try {
      const sentEmail = await this.create(createSentEmailDto, user);
      this.send(sendEmailDto, user, sentEmail.id)
      return await this.sentEmailRepository.findOne({where: { id: sentEmail.id }, relations: ["prospect", "prospect.secondaryActivity", "prospect.secondaryActivity.primaryActivity", "prospect.city", "prospect.phone", "prospect.country","prospect.email", "prospect.website"]});
    } catch (error) {
      console.log(error)
      throw new HttpException("Failed to send", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
