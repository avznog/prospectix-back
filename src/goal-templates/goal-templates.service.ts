import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { UpdateGoalTemplateDto } from './dto/update-goal-template.dto';
import { GoalTemplate } from './entities/goal-template.entity';

@Injectable()
export class GoalTemplatesService {

  constructor(
    @InjectRepository(GoalTemplate)
    private readonly goalTemplateRepository: Repository<GoalTemplate>

  ) {}

  async findAll() : Promise<GoalTemplate[]> {
    try {
      return await this.goalTemplateRepository.find({
        relations: ["goals"],
      });
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de récupérer les objectifs template", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: number, updateGoalTemplateDto: UpdateGoalTemplateDto) : Promise<UpdateResult> {
    try {
      return await this.goalTemplateRepository.update(id, updateGoalTemplateDto);
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de mettre à jour l'objectif template", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
