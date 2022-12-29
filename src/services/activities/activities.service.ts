import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateActivityDto } from 'src/dto/activities/create-activity.dto';
import { Activity } from 'src/entities/activities/activity.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>
  ) {}

  async findAll() : Promise<Activity[]> {
    try {
      return await this.activityRepository.find({
        order: {
          name: "ASC"
        }
      });
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de trouver toutes les activités", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async create(createActivityDto: CreateActivityDto) : Promise<Activity> {
    try {
      return await this.activityRepository.save(createActivityDto);
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de créer l'activité", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
