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
        relations: ["secondaryActivities"]
      });
    } catch (error) {
      console.log(error)
      throw new HttpException("Error while fetching all the primary activities", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
