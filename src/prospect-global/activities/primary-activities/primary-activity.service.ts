import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PrimaryActivity } from 'src/prospect-global/activities/primary-activities/entities/primary-activity.entity';
import { SearchParams } from 'src/admin/search-params/entities/search-params.entity';
import { MoreThan, Repository } from 'typeorm';

@Injectable()
export class PrimaryActivityService {
  
  constructor(
    @InjectRepository(PrimaryActivity)
    private readonly primaryActivityRepository: Repository<PrimaryActivity>,

    @InjectRepository(SearchParams)
    private readonly searchParamRepository: Repository<SearchParams>
  ) {}

  async findAll() : Promise<PrimaryActivity[]> {
    try {
      const searchParams = await this.searchParamRepository.findOne({where: {id: 1}});
      return await this.primaryActivityRepository.find({
        relations: ["secondaryActivities"],
        order: {
          name: 'asc',
          secondaryActivities: {
            name: 'asc'
          }
        },
        where: {
          version: searchParams.versionPrimaryActivity,
          secondaryActivities: {
            // ? If we want to display only the cities that have at least 500 prospects
            // ! INCRESES CONSIDERELY THE REQUEST TIME
            // prospects: MoreThan(500),
            version: searchParams.versionSecondaryActivity
          }
        }
      });
    } catch (error) {
      console.log(error)
      throw new HttpException("Error while fetching all the primary activities", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAllWithoutLimit() {
    try {
      return await this.primaryActivityRepository.find({
        relations: ["secondaryActivities"],
        order: {
          name: 'asc',
          secondaryActivities: {
            name: 'asc'
          }
        }
      })
    } catch (error) {
      console.log(error)
      throw new HttpException("Error while fetching all the primary Activities", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async adjustWeight(id: number, toAdd: number) {
    try {
      const primaryActivity = await this.primaryActivityRepository.findOne({where: {id: id}});
      await this.primaryActivityRepository.update(id, { weight: (primaryActivity.weight + toAdd) / 2 ?? toAdd, weightCount: primaryActivity.weightCount + 1 });
      return {
        ...primaryActivity,
        weight: (primaryActivity.weight + toAdd) / 2 ?? toAdd,
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
