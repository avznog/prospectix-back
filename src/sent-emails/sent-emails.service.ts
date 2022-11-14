import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StageType } from 'src/constants/stage.type';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Between, Repository } from 'typeorm';
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
      const today = new Date();
      const firstd = today.getDate() - today.getDay() + 1;

      //  ? getting the monday of the week
      const monday = new Date(today.setDate(firstd));

      // ? getting the sunday of the week
      const sunday = new Date(today.setDate(firstd + 6));

      // ? setting monday on midnight and sunday on 23:59:59
      monday.setHours(1,0,0,0)
      sunday.setHours(24,59,59,999)

      return await this.sentEmailRepository.count({
        where: {
          pm: {
            pseudo: user.pseudo
          },
          sendingDate: Between(monday, sunday)
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

      //  ! begining of history
      let s = new Date("2022-11-07")

      // ! end of history
      let ed = new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 1 + 6));
      while(s <= ed) {
        let temp = new Date(ed);
        // ! each week sunday
        temp.setDate(s.getDate() + 7)
        results.intervals.push({
          dateDown: new Date(s),
          dateUp: new Date(temp.setHours(0,59,59,999))
        });
        const count = await this.sentEmailRepository.count({
          where: {
            pm: {
              pseudo: user.pseudo
            },
            sendingDate: Between(s, new Date(temp.setHours(0,59,59,999)))
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
}
