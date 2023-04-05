import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSecondaryActivityDto } from 'src/dto/secondary-activities/create-secondary-activity.dto';
import { SecondaryActivity } from 'src/entities/secondary-activities/secondary-activity.entity';
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
          name: "ASC"
        }
      });
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de trouver toutes les activités", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async create(createSecondaryActivityDto: CreateSecondaryActivityDto) : Promise<SecondaryActivity> {
    try {
      return await this.secondaryActivityRepository.save(createSecondaryActivityDto);
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de créer l'activité", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async adjustWeight(id: number, weight: number, toAdd: number) {
    try {
      await this.secondaryActivityRepository.update(id, { weight: Number(((Number(weight)+toAdd)/2).toFixed(5)) ?? toAdd });
      return await this.secondaryActivityRepository.findOne({
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
      const secondaryActivity = await this.secondaryActivityRepository.findOne({
        where: {
          id: id
        }
      });
      return await this.adjustWeight(id, secondaryActivity.weight, 0.05)
    } catch (error) {
      console.log(error)
      throw new HttpException(`Failure while updating the weight of this acitivity with id : ${id}`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
