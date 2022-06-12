import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { InjectRepository} from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { Reminder } from './entities/reminder.entity';
import { ProjectManager } from 'src/project-manager/entities/project-manager.entity';

@Injectable()
export class ReminderService {
  constructor(
    @InjectRepository(Reminder)
    private reminderRepository: Repository<Reminder>,

    @InjectRepository(ProjectManager)
    private pmRepository: Repository<ProjectManager>
  ){}
  
  async create(idPm: number, createReminderDto: CreateReminderDto) {
    try {
    const pm = await this.pmRepository.findOne({
      where: {
        id: idPm
      }
    });
    createReminderDto.pm = pm;
    return await this.reminderRepository.save(createReminderDto);
      
    } catch (error) {
      console.log(error);
    } 
  }

  async findAllFromPm(idPm: number) : Promise<Reminder[]>{
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

  findOne(id: number) {
    return `This action returns a #${id} reminder`;
  }

  update(id: number, updateReminderDto: UpdateReminderDto) {
    return `This action updates a #${id} reminder`;
  }

  remove(id: number) {
    return `This action removes a #${id} reminder`;
  }
}
