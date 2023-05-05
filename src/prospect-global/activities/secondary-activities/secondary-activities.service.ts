import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SecondaryActivity } from 'src/prospect-global/activities/secondary-activities/entities/secondary-activity.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SecondaryActivitiesService {
  constructor(
    @InjectRepository(SecondaryActivity)
    private readonly secondaryActivityRepository: Repository<SecondaryActivity>
  ) {}

  async findAll() : Promise<SecondaryActivity[]> {
    try {
      return await this.secondaryActivityRepository.find({
        order: {
          name: 'asc'
        }
      });
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de trouver toutes les activités", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async adjustWeight(id: number, toAdd: number) {
    try {
      const secondaryActivity = await this.secondaryActivityRepository.findOne({where: {id: id}});
      await this.secondaryActivityRepository.update(id, { weight: (secondaryActivity.weight + toAdd) / 2 ?? toAdd, weightCount: secondaryActivity.weightCount + 1 });
      return {
        ...secondaryActivity,
        weight: (secondaryActivity.weight + toAdd) / 2 ?? toAdd,
        weightCount: secondaryActivity.weightCount + 1 
      }
    } catch (error) {
      console.log(error)
      throw new HttpException(`Failure while updating the weight of this acitivity with id : ${id}`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async adjustWeightNbNo(id: number) {
    try {
      return await this.adjustWeight(id, 0.05)
    } catch (error) {
      console.log(error)
      throw new HttpException(`Failure while updating the weight of this acitivity with id : ${id}`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
