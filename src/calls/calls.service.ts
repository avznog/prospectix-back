import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { cp } from 'fs';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Between, Repository } from 'typeorm';
import { CreateCallDto } from './dto/create-call.dto';
import { UpdateCallDto } from './dto/update-call.dto';
import { Call } from './entities/call.entity';

@Injectable()
export class CallsService {

  constructor(
    @InjectRepository(Call)
    private readonly callRepository: Repository<Call>,

    @InjectRepository(ProjectManager)
    private readonly pmRepository: Repository<ProjectManager>
  ) {}

  async createForMe(createCallDto: CreateCallDto, user: ProjectManager) : Promise<Call> {
    try {
      createCallDto.pm = user;
      return await this.callRepository.save(this.callRepository.create(createCallDto));
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de créer l'appel", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async create(createCallDto: CreateCallDto) {
    try {
      return await this.callRepository.save(this.callRepository.create(createCallDto));
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de créer l'appel", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async countAllForMe(user: ProjectManager) : Promise<number> {
    try {
      return await this.callRepository.count({
        where: {
          pm: {
            id: user.id
          }
        }
      });
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de trouver les appels", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async countAll(interval: { dateDown: Date, dateUp: Date}) {
    try {
      let results: [{}] = [{}];
      results.pop();
      const pms = await this.pmRepository.find({
      relations: ["calls"],
      where: {
        admin: false,
      } 
      });
      for(let pm of pms) {
        let count = 0;
        pm.calls ? pm.calls.forEach(call => {
          if(new Date(interval.dateDown) < new Date(call.date) && new Date(call.date) < new Date(interval.dateUp)){
            count += 1
          }
        }) : 0;

       results.push({
        pseudo: pm.pseudo,
        count: count
       }) 
      }
      console.log(interval)
      console.log(results)
      return results;
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de compter les appels",HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
