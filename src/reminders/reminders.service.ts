import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { InjectRepository} from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { Reminder } from './entities/reminder.entity';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Prospect } from 'src/prospects/entities/prospect.entity';

@Injectable()
export class RemindersService {
  constructor(
    @InjectRepository(Reminder)
    private reminderRepository: Repository<Reminder>,

    @InjectRepository(ProjectManager)
    private pmRepository: Repository<ProjectManager>,

    @InjectRepository(Prospect)
    private prospectRepository: Repository<Prospect>
  ){}
  
  async create(idPm: number, createReminderDto: CreateReminderDto, idProspect: number) : Promise<Reminder>{
    try {
    const pm = await this.pmRepository.findOne({
      where: {
        id: idPm
      }
    });

    const prospect = await this.prospectRepository.findOne({
      where: {
        id: idProspect
      }
    });
    createReminderDto.pm = pm;
    createReminderDto.prospect = prospect;
    return await this.reminderRepository.save(createReminderDto);
      
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de créer un rappel pour cet utilisateur", HttpStatus.BAD_REQUEST)
      
    } 
  }

  async findAllByPm(idPm: number) : Promise<Reminder[]>{
    try{
      const pm = await this.pmRepository.findOne({
        where: {
          id: idPm
        }
      });

      return await this.reminderRepository.find({
        relations: ["pm"],
        where: {
          pm: {
            id: pm.id
          }
        }
      });
    } catch (error){
      throw new HttpException("Le Cdp n'existe pas dans la base de données", HttpStatus.BAD_REQUEST)
    }
    
  }

  async findAllByProspect(idProspect: number): Promise<Reminder[]> {
    try {
      const prospect = await this.prospectRepository.findOne({
        where: {
          id: idProspect
        }
      })

      return await this.reminderRepository.find({
        relations: ["prospect"],
        where: {
          prospect: {
            id: prospect.id
          }
        }
      })
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de trouver les rappels pour ce prospect", HttpStatus.BAD_REQUEST)
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} reminder`;
  }

  async update(id: number, updateReminderDto: UpdateReminderDto) {
    
  }

  remove(id: number) {
    return `This action removes a #${id} reminder`;
  }
}
