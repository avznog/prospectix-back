import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { lastDayOfWeek } from 'date-fns';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Between, MoreThan, Repository } from 'typeorm';
import { CreateNegativeAnswerDto } from './dto/create-negative-answer.dto';
import { UpdateNegativeAnswerDto } from './dto/update-negative-answer.dto';
import { NegativeAnswer } from './entities/negative-answer.entity';

@Injectable()
export class NegativeAnswersService {

  constructor(
    @InjectRepository(NegativeAnswer)
    private readonly negativeAnswerRepository: Repository<NegativeAnswer>
  ) {}

  async create(createNegativeAnswerDto: CreateNegativeAnswerDto) {
    try {
      return await this.negativeAnswerRepository.save(this.negativeAnswerRepository.create(createNegativeAnswerDto));
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de créer l'appel", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createForMe(createNegativeAnswerDto: CreateNegativeAnswerDto, user: ProjectManager) : Promise<NegativeAnswer> {
    try {
      createNegativeAnswerDto.pm = user;
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
      let startDate = new Date("2022-11-07T00:00:00.000Z")
      let endDate = lastDayOfWeek(new Date(), {weekStartsOn: 2});
      let d = new Date("2022-11-07T00:00:00.000Z");
      while(startDate  < endDate) {
        d.setDate(startDate.getDate() + 7)
        results.intervals.push({
          dateDown: new Date(startDate),
          dateUp: new Date(d)
        });
        const count =  await this.negativeAnswerRepository.count({
          where: {
            pm: {
              pseudo: user.pseudo
            },
            date: Between(new Date(startDate), new Date(d))
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
