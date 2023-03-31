import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { lastDayOfWeek } from 'date-fns';
import { StageType } from 'src/constants/stage.type';
import { CreateSentEmailDto } from 'src/dto/sent-emails/create-sent-email.dto';
import { ResearchParamsSentEmailsDto } from 'src/dto/sent-emails/research-params-sent-emails.dto';
import { sendEmailDto } from 'src/dto/sent-emails/send-email.dto';
import { MailTemplate } from 'src/entities/mail-templates/mail-template.entity';
import { ProjectManager } from 'src/entities/project-managers/project-manager.entity';
import { Prospect } from 'src/entities/prospects/prospect.entity';
import { SentEmail } from 'src/entities/sent-emails/sent-email.entity';
import { Between, Repository, UpdateResult } from 'typeorm';
import { ActivitiesService } from '../activities/activities.service';
import { GoogleService } from '../google/google.service';
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
    private readonly activitiesService: ActivitiesService
  ) { }

  async findAllPaginated(researchParamsSentEmailsDto: ResearchParamsSentEmailsDto, user: ProjectManager) {
    try {
      await this.checkMailsSynchro()
      return await this.sentEmailRepository.find({
        relations: ["pm", "prospect", "prospect.activity", "prospect.city", "prospect.country", "prospect.phone", "prospect.email", "prospect.website", "prospect.reminders", "prospect.meetings", "prospect.events", "prospect.bookmarks"],
        where: {
          pm: {
            pseudo: user.pseudo
          },
          prospect: {
            stage: StageType.MAIL
          },
          sent: false
        },
        order: {
          sendingDate: "ASC"
        },
        take: researchParamsSentEmailsDto.take,
        skip: researchParamsSentEmailsDto.skip
      })
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de récupérer les emails non envoyés", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAllPaginatedSent(researchParamsSentEmailsDto: ResearchParamsSentEmailsDto, user: ProjectManager) {
    try {
      await this.checkMailsSynchro();
      return await this.sentEmailRepository.find({
        relations: ["pm", "prospect", "prospect.activity", "prospect.city", "prospect.country", "prospect.phone", "prospect.email", "prospect.website", "prospect.reminders", "prospect.meetings", "prospect.events", "prospect.bookmarks"],
        where: {
          pm: {
            pseudo: user.pseudo
          },
          prospect: {
            stage: StageType.MAIL_SENT
          },
          sent: true
        },
        order: {
          sendingDate: "ASC"
        },
        take: researchParamsSentEmailsDto.take,
        skip: researchParamsSentEmailsDto.skip
      })
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de récupérer les emails envoyés", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async markSent(idSentEmail: number, templateName: string, object: string): Promise<UpdateResult> {
    try {
      return await this.sentEmailRepository.update(idSentEmail, { sent: true, sendingDate: new Date(), templateName: templateName, object: object });
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
      createSentEmailDto.pm = user;
      console.log(createSentEmailDto)
      this.activitiesService.adjustWeight(createSentEmailDto.prospect.activity.id,createSentEmailDto.prospect.activity.weight, 0.09)
      return await this.sentEmailRepository.save(createSentEmailDto);
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de créer l'email", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async countSentEmails(user: ProjectManager, researchParamsSentEmailsDto: ResearchParamsSentEmailsDto): Promise<number> {
    try {
      return await this.sentEmailRepository.count({
        where: {
          pm: {
            pseudo: user.pseudo
          },
          prospect: {
            stage: StageType.MAIL
          },
          sent: false
        }
      })
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de compter les mails", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async countSentEmailsSent(user: ProjectManager, researchParamsSentEmailsDto: ResearchParamsSentEmailsDto): Promise<number> {
    try {
      return await this.sentEmailRepository.count({
        where: {
          pm: {
            pseudo: user.pseudo
          },
          prospect: {
            stage: StageType.MAIL_SENT
          },
          sent: true
        }
      })
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de compter les mails", HttpStatus.INTERNAL_SERVER_ERROR);
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

  async send(sendEmailDto: sendEmailDto, pm: ProjectManager, idSentEmail: number) {
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
      return await this.sentEmailRepository.update(idSentEmail, { sent: true, sendingDate: new Date(), templateName: "Envoyé séparément", object: object });
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de marquer le mail comme envoyé séparément", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
