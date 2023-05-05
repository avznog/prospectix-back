import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateGoalTemplateDto } from 'src/goals-global/goal-templates/dto/create-goal-template.dto';
import { GoalTemplate } from 'src/goals-global/goal-templates/entities/goal-template.entity';
import { Goal } from 'src/goals-global/goals/entities/goal.entity';
import { ProjectManager } from 'src/users/project-managers/entities/project-manager.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UpdateGoalTemplateDto } from './dto/update-goal-template.dto';

@Injectable()
export class GoalTemplatesService {

  constructor(
    @InjectRepository(GoalTemplate)
    private readonly goalTemplateRepository: Repository<GoalTemplate>,

    @InjectRepository(ProjectManager)
    private readonly pmRepository: Repository<ProjectManager>,

    @InjectRepository(Goal)
    private readonly goalRepository: Repository<Goal>

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

  async create(createGoalTemplateDto: CreateGoalTemplateDto) : Promise<{goalTemplate: GoalTemplate, goals: Goal[]}> {
    try {
      let goalTemplate = await this.goalTemplateRepository.save(this.goalTemplateRepository.create(createGoalTemplateDto));
      let pms = await this.pmRepository.find({
        where: {
          objectived: true
        }
      });

      
      for(let pm of pms) {
        await this.goalRepository.save(this.goalRepository.create({
          disabled: true,
          pm: pm,
          goalTemplate: goalTemplate,
          value: createGoalTemplateDto.default
        }))
      }
      let goals = await this.goalRepository.find({
        relations: ["pm", "goalTemplate"],
        where: {
          goalTemplate: {
            id: goalTemplate.id
          }
        }
      })
      return { goalTemplate: goalTemplate, goals: goals };
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de créer l'objectif " + createGoalTemplateDto, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async delete(id: number, user: ProjectManager) : Promise<DeleteResult> {
    try {
      let goals = await this.goalRepository.find({
        where: {
          goalTemplate: {
            id: id
          }
        }
      });

      for(let goal of goals) {
        await this.goalRepository.delete(goal.id);
      }
      return this.goalTemplateRepository.delete(id);
    } catch (error) {
      console.log(error)
      throw new HttpException(`Impossible de supprimer l'objectif (${user.pseudo} à ${new Date().toISOString()}) `, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
