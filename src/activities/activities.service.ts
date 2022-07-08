import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './entities/activity.entity';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>
  ) {}

  async findAll() : Promise<Activity[]> {
    try {
      return await this.activityRepository.find();
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de trouver toutes les activités", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
