import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { StageType } from 'src/constants/stage.type';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { DeleteResult, In, Repository, UpdateResult } from 'typeorm';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { ResearchParamsRemindersDto } from './dto/research-params-reminders.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { Reminder } from './entities/reminder.entity';

@Injectable()
export class RemindersService {
  constructor(
    @InjectRepository(Reminder)
    private reminderRepository: Repository<Reminder>,

    @InjectRepository(ProjectManager)
    private pmRepository: Repository<ProjectManager>
  ){}
  
  async update(id: number, updateReminderDto: UpdateReminderDto) {
    try {
      return await this.reminderRepository.update(id, updateReminderDto);
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de modifier le rappel", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async create(createReminderDto: CreateReminderDto, user: ProjectManager) : Promise<Reminder>{
    try {
      createReminderDto.pm = user;
      return await this.reminderRepository.save(createReminderDto);
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de créer un rappel pour cet utilisateur", HttpStatus.BAD_REQUEST)
      
    } 
  }

  async findAllByProspect(idProspect: number): Promise<Reminder[]> {
    try {
      return await this.reminderRepository.find({
        relations: ["pm", "prospect", "prospect.activity", "prospect.city", "prospect.country", "prospect.meetings", "prospect.phone", "prospect.website", "prospect.email"],
        where: {
          prospect: {
            id: idProspect
          }
        }
      })
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de trouver les rappels pour ce prospect", HttpStatus.BAD_REQUEST)
    }
  }

  async delete(idReminder: number) : Promise<DeleteResult> {
    try {
      return await this.reminderRepository.delete(idReminder);  
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de supprimer le rappel",HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async markDone(idReminder: number) : Promise<UpdateResult> {
    try {
      return await this.reminderRepository.update(idReminder, { done: true });
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de désactiver le rappel", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  
  async findAllPaginated(researchParamsRemindersDto: ResearchParamsRemindersDto, user: ProjectManager) : Promise<Reminder[]> {
    try {
      return await this.reminderRepository.find({
        relations: ["pm", "prospect","prospect.phone","prospect.email", "prospect.activity","prospect.city","prospect.country","prospect.website","prospect.email","prospect.meetings","prospect.bookmarks","prospect.reminders"],
        where: [
          researchParamsRemindersDto.priority != 0 && {
            prospect: {
              stage: StageType.REMINDER
            },
            done: researchParamsRemindersDto.done == "true" ? true: false,
            pm: {
              pseudo: user.pseudo
            },
            priority: researchParamsRemindersDto.priority
          },
          researchParamsRemindersDto.priority == 0 && {
            prospect: {
              stage: StageType.REMINDER
            },
            done: researchParamsRemindersDto.done == "true" ? true: false,
            pm: {
              pseudo: user.pseudo
            },
            priority: In([1,2,3])
          }
        ],
      });
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de récupérer les rappels", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findAllRemindersDone(researchParamsRemindersDto: ResearchParamsRemindersDto, user: ProjectManager) : Promise<Reminder[]> {
    try {
      return await this.reminderRepository.find({
        relations: ["pm", "prospect","prospect.phone","prospect.email", "prospect.activity","prospect.city","prospect.country","prospect.website","prospect.email","prospect.meetings","prospect.bookmarks","prospect.reminders"],
        where: [
          researchParamsRemindersDto.priority != 0 && {
          done: true,
          pm: {
            pseudo: user.pseudo
          },
          priority: researchParamsRemindersDto.priority
        },
        researchParamsRemindersDto.priority == 0 && {
          done: true,
          pm: {
            pseudo: user.pseudo
          },
          priority: In([1,2,3])
        }
      ],
      skip: researchParamsRemindersDto.skip,
      take: researchParamsRemindersDto.take
      })
    
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de récupérer les rappels", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async countReminders(researchParamsRemindersDto: ResearchParamsRemindersDto, user: ProjectManager) : Promise<number> {
    try {
      return await this.reminderRepository.count({
        where: [
          researchParamsRemindersDto.priority != 0 && {
            prospect: {
              stage: StageType.REMINDER
            },
            done: researchParamsRemindersDto.done == "true" ? true: false,
            pm: {
              pseudo: user.pseudo
            },
            priority: researchParamsRemindersDto.priority
          },
          researchParamsRemindersDto.priority == 0 && {
            prospect: {
              stage: StageType.REMINDER
            },
            done: researchParamsRemindersDto.done == "true" ? true: false,
            pm: {
              pseudo: user.pseudo
            },
            priority: In([1,2,3])
          }
        ]
      });
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de compter les rappels", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async countAllForMe(user: ProjectManager) : Promise<number> {
    try {
      return await this.reminderRepository.count({
        where: {
          pm: {
            id: user.id
          }
        }
      });
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de compter les rappels", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async countAll(interval: { dateDown: Date, dateUp: Date }) {
    try {
      let results : [{}] = [{}];
      results.pop();
      const pms = await this.pmRepository.find({
        relations: ["reminders"],
        where: {
          admin: false
        }
      }).then(pms => {
        pms.forEach(pm => {
          let count = 0;
          pm.reminders.length > 0 && pm.reminders.forEach(reminder => {
            if(new Date(interval.dateDown) < new Date(reminder.date) && new Date(reminder.date) < new Date(interval.dateUp)){
              count += 1;
            }
            
          })
          results.push({
            pseudo: pm.pseudo,
            count: count
          });
        })
      });
      return results
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de compter les rapels", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
