import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateStatisticDto } from './dto/update-statistic.dto';
import { Statistic } from './entities/statistic.entity';

@Injectable()
export class StatisticsService {

  constructor(
    @InjectRepository(Statistic)
    private readonly statisticRepository: Repository<Statistic>
  ) {}

  async update(id: number, updateStatisticDto: UpdateStatisticDto) {
    try {
      return await this.statisticRepository.update(id, updateStatisticDto);
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de modifier la statistique", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
