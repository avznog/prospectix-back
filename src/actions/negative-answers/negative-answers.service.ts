import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment';
import { CreateNegativeAnswerDto } from 'src/actions/negative-answers/dto/create-negative-answer.dto';
import { NegativeAnswer } from 'src/actions/negative-answers/entities/negative-answer.entity';
import { PrimaryActivityService } from 'src/prospect-global/activities/primary-activities/primary-activity.service';
import { SecondaryActivitiesService } from 'src/prospect-global/activities/secondary-activities/secondary-activities.service';
import { ProjectManager } from 'src/users/project-managers/entities/project-manager.entity';
import { Between, MoreThan, Repository } from 'typeorm';

@Injectable()
export class NegativeAnswersService {

  constructor(
    @InjectRepository(NegativeAnswer)
    private readonly negativeAnswerRepository: Repository<NegativeAnswer>,
    
    private readonly secondaryActivitiesService: SecondaryActivitiesService,
    private readonly primaryActivitiesService: PrimaryActivityService
  ) {}

  async create(createNegativeAnswerDto: CreateNegativeAnswerDto) {
    try {
      createNegativeAnswerDto.date = moment(createNegativeAnswerDto.date).tz('Europe/Paris').toDate();
      return await this.negativeAnswerRepository.save(this.negativeAnswerRepository.create(createNegativeAnswerDto));
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de créer l'appel", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createForMe(createNegativeAnswerDto: CreateNegativeAnswerDto, user: ProjectManager) : Promise<NegativeAnswer> {
    try {
      createNegativeAnswerDto.date = moment(createNegativeAnswerDto.date).tz('Europe/Paris').toDate();
      createNegativeAnswerDto.pm = user;
      await this.secondaryActivitiesService.adjustWeight(createNegativeAnswerDto.prospect.secondaryActivity.id, 0)
      await this.primaryActivitiesService.adjustWeight(createNegativeAnswerDto.prospect.secondaryActivity.primaryActivity.id, 0)
      return await this.negativeAnswerRepository.save(this.negativeAnswerRepository.create(createNegativeAnswerDto));
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de créer l'appel", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async countAllForMe(user: ProjectManager) : Promise<number> {
    try {
      return await this.negativeAnswerRepository.count({
        where: {
          pm: {
            id: user.id
          }
        }
      });
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de trouver les appels", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async countWeeklyForMe(user: ProjectManager) : Promise<number> {
    try {
      let currentDate = new Date;
      var endDate = new Date(currentDate.setDate((currentDate.getDate() - currentDate.getDay() - 6) + 6));
      return await this.negativeAnswerRepository.count({
        where: {
          pm: {
            pseudo: user.pseudo
          },
          date: MoreThan(endDate)
        }
      })
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de récupérer les appels de la derniere semaine",HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async countAllByWeeksForMe(user: ProjectManager) {
    try {
      let results: { intervals: [{dateDown: Date, dateUp: Date}], data: [number]} = {intervals: [{dateDown: new Date, dateUp: new Date}], data: [0]};
      results.data.pop();
      results.intervals.pop();

      //  ! begining of history
      let s = new Date("2022-11-07")
      let temp = new Date("2022-11-07")

      // ! end of history
      let ed = new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 1 + 6));
      while(s <= ed) {

        // ! each week sunday
        temp.setDate(temp.getDate() + 7)
        results.intervals.push({
          dateDown: new Date(s),
          dateUp: new Date(temp.setHours(0,59,59,999))
        });
        const count = await this.negativeAnswerRepository.count({
          where: {
            pm: {
              pseudo: user.pseudo
            },
            date: Between(s, new Date(temp.setHours(0,59,59,999)))
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
