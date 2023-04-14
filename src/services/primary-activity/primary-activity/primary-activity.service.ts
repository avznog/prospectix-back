import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PrimaryActivity } from 'src/entities/primary-activity/primary-activity.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PrimaryActivityService {
  
  constructor(
    @InjectRepository(PrimaryActivity)
    private readonly primaryActivityRepository: Repository<PrimaryActivity>
  ) {}

  async findAll() : Promise<PrimaryActivity[]> {
    try {
      return await this.primaryActivityRepository.find({
        relations: ["secondaryActivities"],
        order: {
          name: 'asc',
          secondaryActivities: {
            name: 'asc'
          }
        }
      });
    } catch (error) {
      console.log(error)
      throw new HttpException("Error while fetching all the primary activities", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async adjustWeight(id: number, weight: number, weightCount: number, toAdd: number) {
    try {
      await this.primaryActivityRepository.update(id, { weight: Number(((Number(weight)+toAdd)/2).toFixed(5)) ?? toAdd, weightCount: weightCount + 1 });
      return await this.primaryActivityRepository.findOne({
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
      const primaryActivity = await this.primaryActivityRepository.findOne({
        where: {
          id: id
        }
      });
      return await this.adjustWeight(id, primaryActivity.weight, primaryActivity.weightCount, 0.05)
    } catch (error) {
      console.log(error)
      throw new HttpException(`Failure while updating the weight of this acitivity with id : ${id}`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
