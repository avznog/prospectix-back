import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';
import { CreateGoalDto } from './dto/create-goal.dto';
import { Goal } from './entities/goal.entity';

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(ProjectManager)
    private readonly pmRepository: Repository<ProjectManager>,

    @InjectRepository(Goal)
    private readonly goalRepository: Repository<Goal>
  ) {}

  async create(createGoalDto: CreateGoalDto, idPm: number) : Promise<Goal>{
    try{
      const pm = await this.pmRepository.findOne({
        where: {
          id: idPm
        }
      });
      
      if(!pm)
        throw new HttpException("Ce chef de projet n'existe pas !", HttpStatus.NOT_FOUND)
      createGoalDto.pm = pm;
      
      return await this.goalRepository.save(createGoalDto);
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de créer un objectif pour ce chef de projet", HttpStatus.BAD_REQUEST)
    }
  }

  async findAll() : Promise<Goal[]> {
    return await this.goalRepository.find();
  }

  async findAllByCurrentPm(idPm: number) : Promise<Goal[]> {
    try {
      return this.goalRepository.find({
        relations: ["pm"],
        where: {
          pm: {
            id: idPm
          }
        }
      });
    } catch (error) {
      console.log(error);
      throw new HttpException("Impossible de récupérer les objectifs pour le chef de projet connecté", HttpStatus.BAD_REQUEST)
    }
  }

  async findAllByPm(pseudoPm: string) : Promise<Goal[]> {
    try{
      const goals =  this.goalRepository.find({
        relations: ["pm"],
        where: {
          pm: {
            pseudo: pseudoPm
          }
        }
      }); 
      if( (await goals).length == 0){
        throw new HttpException("Il n'y a aucun objectif pour " + pseudoPm, HttpStatus.OK)
      }
    
      return goals;
    } catch (error){
      console.log(error)
      throw new HttpException("Impossible de récupérer les objectfis pour ce chef de projet", HttpStatus.BAD_REQUEST)
    }
  }

  async findAllByTitleAndCurrentPm(title: string, pseudoPm: string) : Promise<Goal[]> {
    try {
      return await this.goalRepository.find({
        relations: ["pm"],
        where: {
          pm: {
            pseudo: pseudoPm
          },
          title: Like("%" + title + "%")
        }
      });
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de récupérer les objectifs pour le chef de projet connecté", HttpStatus.NOT_FOUND)
    }
  }

  async findAllByTitleAndPm(title: string, pseudoPm: string) : Promise<Goal[]> {
    try {
      return await this.goalRepository.find({
        relations: ["pm"],
        where: {
          pm: {
            pseudo: pseudoPm
          },
          title: Like("%" + title + "%")
        }
      });
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de récupérer les objectifs pour le chef de projet demandé", HttpStatus.NOT_FOUND)
    }
  }

  async update(updateGoalDto) : Promise<UpdateResult> {
    try {
      return await this.goalRepository.update(updateGoalDto.id, updateGoalDto);  
    } catch (error) {
      console.log(error)
      throw new HttpException("impossible de modifier l'objectif", HttpStatus.INTERNAL_SERVER_ERROR)
    }
    
  }

  async delete(id: number) : Promise<DeleteResult> {
    try {
      return await this.goalRepository.delete(id);
    } catch (error) {
      console.log(error);
      throw new HttpException("Impossible de supprimer l'objectif", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
