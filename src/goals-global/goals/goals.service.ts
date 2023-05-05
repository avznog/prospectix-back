import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProjectManager } from "src/users/project-managers/entities/project-manager.entity";
import { Repository } from "typeorm";
import { GoalTemplate } from "../goal-templates/entities/goal-template.entity";
import { UpdateGoalDto } from "./dto/update-goal.dto";
import { Goal } from "./entities/goal.entity";


@Injectable()
export class GoalsService {

  constructor(
    @InjectRepository(Goal)
    private readonly goalRepository: Repository<Goal>,

    @InjectRepository(GoalTemplate)
    private readonly goalTemplateRepository: Repository<GoalTemplate>,

    @InjectRepository(ProjectManager)
    private readonly pmRepository: Repository<ProjectManager>
  ) {}

  
  async findAll() : Promise<Goal[]> {
    try {
      return await this.goalRepository.find({
        relations: ["pm","goalTemplate","pm.goals"]
      })
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de récupérer tous les objectifs", HttpStatus.INTERNAL_SERVER_ERROR  )
    }
  }

  async update(id: number, updateGoalDto: UpdateGoalDto) {
    try {
      return await this.goalRepository.update(id, updateGoalDto);
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de mettre à jour l'objectif", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async check(id: number) {
    try {
      let goalTemplates = await this.goalTemplateRepository.find();
      let pm = await this.pmRepository.findOne({
        relations: ["goals", "goals.goalTemplate"],
        where: {
          id: id
        }
      });
      let go = [];

      for(let goal of pm.goals) {
        go.push(goal.goalTemplate.id);
      }

      for(let goalTemplate of goalTemplates) {
        if(!go.includes(goalTemplate.id)) {
          await this.goalRepository.save(this.goalRepository.create({
            disabled: true,
            pm: pm,
            goalTemplate: goalTemplate,
            value: goalTemplate.default
          }))
        }
      }

      let pmWithGoals =  await this.pmRepository.findOne({
        relations: ["goals", "goals.goalTemplate"],
        where: {
          id: id
        }
      });

      return pmWithGoals.goals;

    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de vérifier les objectifs", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
