import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Repository, UpdateResult } from 'typeorm';
import { UpdateStatisticDto } from './dto/update-statistic.dto';
import { Statistic } from './entities/statistic.entity';

@Injectable()
export class StatisticsService {

  constructor(
    @InjectRepository(Statistic)
    private readonly statisticRepository: Repository<Statistic>
  ) {}

  async update(id: number, updateStatisticDto: UpdateStatisticDto) : Promise<UpdateResult> {
    try {
      return await this.statisticRepository.update(id, updateStatisticDto);
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de modifier la statistique", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findMyStats(user: ProjectManager) : Promise<Statistic> {
    try {
      const stat = await this.statisticRepository.findOne({
        where: {
          pm: {
            pseudo: user.pseudo
          }
        }
      });
      if(!stat){
        return await this.statisticRepository.save(this.statisticRepository.create({
          pm: user,
          totalCalls: 0,
          totalMeetings: 0,
          totalReminders: 0,
          totalSentEmails: 0,
          totalNegativeAnswers: 0,
          weeklyCalls: 0,
          weeklyMeetings: 0,
          weeklyReminders: 0,
          weeklySentEmails: 0,
          weeklyNegativeAnswers: 0
        }));
      }
        
      return stat;
      
    } catch (error) {
      console.log(error);
      throw new HttpException("Impossible de récupérer les statistics", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
