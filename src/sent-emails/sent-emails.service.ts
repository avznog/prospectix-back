import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { lastDayOfWeek } from 'date-fns';
import { StageType } from 'src/constants/stage.type';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Between, MoreThan, Repository } from 'typeorm';
import { CreateSentEmailDto } from './dto/create-sent-email.dto';
import { ResearchParamsSentEmailsDto } from './dto/research-params-sent-emails.dto';
import { SentEmail } from './entities/sent-email.entity';

@Injectable()
export class SentEmailsService {

  constructor(
    @InjectRepository(SentEmail)
    private readonly sentEmailRepository: Repository<SentEmail>,

    @InjectRepository(ProjectManager)
    private readonly pmRepository: Repository<ProjectManager>
  ) {}

  async findAllPaginated(researchParamsSentEmailsDto: ResearchParamsSentEmailsDto, user: ProjectManager) {
    try {
      return await this.sentEmailRepository.find({
        relations: ["pm", "prospect", "prospect.activity","prospect.city","prospect.country", "prospect.phone","prospect.email", "prospect.website", "prospect.reminders","prospect.meetings","prospect.events","prospect.bookmarks"],
        where: {
          pm: {
            pseudo: user.pseudo
          },
          prospect: {
            stage: StageType.MAIL
          }
        },
        take: researchParamsSentEmailsDto.take,
        skip: researchParamsSentEmailsDto.skip
      })
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de récupérer les emails envoyés", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async create(createSentEmailDto: CreateSentEmailDto, user: ProjectManager) : Promise<SentEmail> {
    try {
      createSentEmailDto.pm = user;
      return await this.sentEmailRepository.save(createSentEmailDto);
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de créer l'email", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async countSentEmails(user: ProjectManager) : Promise<number> {
    try {
      return await this.sentEmailRepository.count({
        where: {
          pm: {
            pseudo: user.pseudo
          },
          prospect: {
            stage: StageType.MAIL
          }
        }
      })
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de compter les mails", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async countWeeklyForMe(user: ProjectManager) : Promise<number> {
    try {
      let currentDate = new Date;
      var endDate = new Date(currentDate.setDate((currentDate.getDate() - currentDate.getDay() - 6) + 6));
      return await this.sentEmailRepository.count({
        where: {
          pm: {
            pseudo: user.pseudo
          },
          sendingDate: MoreThan(endDate)
        }
      })
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de récupérer les appels de la derniere semaine",HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async countAllForMe(user: ProjectManager) : Promise<number> {
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
      let results : [{}] = [{}];
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
            if(new Date(interval.dateDown) < new Date(sentEmail.sendingDate) && new Date(sentEmail.sendingDate) < new Date(interval.dateUp)){
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
      let results: { intervals: [{dateDown: Date, dateUp: Date}], data: [number]} = {intervals: [{dateDown: new Date, dateUp: new Date}], data: [0]};
      results.data.pop();
      results.intervals.pop();
      let startDate = new Date("2022-11-07T00:00:00.000Z");
      let endDate = lastDayOfWeek(new Date(), {weekStartsOn: 2});
      let d = new Date("2022-11-07T00:00:00.000Z");
      while(startDate  < endDate) {
        d.setDate(startDate.getDate() + 7)
        results.intervals.push({
          dateDown: new Date(startDate),
          dateUp: new Date(d)
        });
        const count = await this.sentEmailRepository.count({
          where: {
            pm: {
              pseudo: user.pseudo
            },
            sendingDate: Between(new Date(startDate), new Date(d))
          }
        })
        results.data.push(count)
        startDate.setDate(startDate.getDate() + 7)
      }
      return results
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de compter les appels par semaines", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
