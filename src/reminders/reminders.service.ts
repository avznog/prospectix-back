import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { lastDayOfWeek } from 'date-fns';
import { StageType } from 'src/constants/stage.type';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Between, DeleteResult, In, MoreThan, Repository, UpdateResult } from 'typeorm';
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
        order: {
          date: "ASC"
        }
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

  async countWeeklyForMe(user: ProjectManager) : Promise<number> {
    try {
      let currentDate = new Date;
      var endDate = new Date(currentDate.setDate((currentDate.getDate() - currentDate.getDay() - 6) + 6));
      return await this.reminderRepository.count({
        where: {
          pm: {
            pseudo: user.pseudo
          },
          date: MoreThan(endDate)
        }
      })
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de récupérer les appels de la derniere semaine",HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async countAll(interval: { dateDown: Date, dateUp: Date }) {
    try {
      let results : [{}] = [{}];
      results.pop();
      await this.pmRepository.find({
        relations: ["reminders"],
        where: {
          statsEnabled: true
        }
      }).then(pms => {
        pms.forEach(pm => {
          let count = 0;
          pm.reminders.length > 0 && pm.reminders.forEach(reminder => {
            if(new Date(interval.dateDown) < new Date(reminder.creationDate) && new Date(reminder.creationDate) < new Date(interval.dateUp)){
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
      throw new HttpException("Impossible de compter les rappels", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async countAllByWeeksForMe(user: ProjectManager) {
    try {
      let results: { intervals: [{dateDown: Date, dateUp: Date}], data: [number]} = {intervals: [{dateDown: new Date, dateUp: new Date}], data: [0]};
      results.data.pop();
      results.intervals.pop();
      let startDate = new Date("2022-11-07T00:00:00.000Z");
      let endDate = lastDayOfWeek(new Date(), {weekStartsOn: 2});
      let d = new Date("2022-11-07T00:00:00.000Z");
      while(startDate  < endDate) {
        d.setDate(startDate.getDate() + 7)
        results.intervals.push({
          dateDown: new Date(startDate),
          dateUp: new Date(d)
        });
        const count =  await this.reminderRepository.count({
          where: {
            pm: {
              pseudo: user.pseudo
            },
            date: Between(new Date(startDate), new Date(d))
          }
        })
        results.data.push(count)
        startDate.setDate(startDate.getDate() + 7)
      }
      return results
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de compter les appels par semaines", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
