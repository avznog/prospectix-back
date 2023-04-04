import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSecondaryActivityDto } from 'src/dto/secondary-activities/create-secondary-activity.dto';
import { SecondaryActivity } from 'src/entities/secondary-activities/secondary-activity.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(SecondaryActivity)
    private readonly activityRepository: Repository<SecondaryActivity>
  ) {}

  async findAll() : Promise<SecondaryActivity[]> {
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

  async create(createActivityDto: CreateSecondaryActivityDto) : Promise<SecondaryActivity> {
    try {
      return await this.activityRepository.save(createActivityDto);
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de créer l'activité", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async adjustWeight(id: number, weight: number, toAdd: number) {
    try {
      await this.activityRepository.update(id, { weight: Number(((Number(weight)+toAdd)/2).toFixed(5)) ?? toAdd });
      return await this.activityRepository.findOne({
        where: {
          id: id
        }
      });
    } catch (error) {
      console.log(error)
      throw new HttpException(`Failure while updating the weight of this acitivity with id : ${id}`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async adjustWeightNbNo(id: number) {
    try {
      const activity = await this.activityRepository.findOne({
        where: {
          id: id
        }
      });
      return await this.adjustWeight(id, activity.weight, 0.05)
    } catch (error) {
      console.log(error)
      throw new HttpException(`Failure while updating the weight of this acitivity with id : ${id}`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
