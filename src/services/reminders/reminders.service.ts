import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { lastDayOfWeek } from 'date-fns';
import { StageType } from 'src/constants/stage.type';
import { CreateReminderDto } from 'src/dto/reminders/create-reminder.dto';
import { ResearchParamsRemindersDto } from 'src/dto/reminders/research-params-reminders.dto';
import { UpdateReminderDto } from 'src/dto/reminders/update-reminder.dto';
import { ProjectManager } from 'src/entities/project-managers/project-manager.entity';
import { Reminder } from 'src/entities/reminders/reminder.entity';
import { Between, DeleteResult, In, Repository, UpdateResult } from 'typeorm';
import { SecondaryActivitiesService } from '../secondary-activities/secondary-activities.service';

@Injectable()
export class RemindersService {
  constructor(
    @InjectRepository(Reminder)
    private reminderRepository: Repository<Reminder>,

    @InjectRepository(ProjectManager)
    private pmRepository: Repository<ProjectManager>,

    private readonly secondaryActivitiesService: SecondaryActivitiesService
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
      this.secondaryActivitiesService.adjustWeight(createReminderDto.prospect.secondaryActivity.id, createReminderDto.prospect.secondaryActivity.weight, createReminderDto.priority == 3 ? 0.8 : createReminderDto.priority == 2 ? 0.4 : 0.1);
      return await this.reminderRepository.save(createReminderDto);
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de créer un rappel pour cet utilisateur", HttpStatus.BAD_REQUEST)
      
    } 
  }

  async findAllByProspect(idProspect: number): Promise<Reminder[]> {
    try {
      return await this.reminderRepository.find({
        relations: ["pm", "prospect", "prospect.secondaryActivity", "prospect.city", "prospect.country", "prospect.meetings", "prospect.phone", "prospect.website", "prospect.email"],
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

  
  async findAllPaginated(researchParamsRemindersDto: ResearchParamsRemindersDto, user: ProjectManager) : Promise<{reminders: Reminder[], count: number}> {
    try {
      const whereParameters = [
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
      ];

      const reminders = await this.reminderRepository.find({
        relations: ["pm", "prospect","prospect.phone","prospect.email", "prospect.secondaryActivity","prospect.city","prospect.country","prospect.website","prospect.email","prospect.meetings","prospect.bookmarks","prospect.reminders"],
        where: whereParameters,
        order: {
          date: "ASC"
        }
      });

      const countReminders = await this.reminderRepository.countBy(whereParameters);

      return {
        reminders: reminders,
        count: countReminders
      };
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de récupérer les rappels", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findAllRemindersDone(researchParamsRemindersDto: ResearchParamsRemindersDto, user: ProjectManager) : Promise<{remindersDone: Reminder[], count: number}> {
    try {
      const whereParameters = [
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
    ];

      const remindersDone = await this.reminderRepository.find({
        relations: ["pm", "prospect","prospect.phone","prospect.email", "prospect.secondaryActivity","prospect.city","prospect.country","prospect.website","prospect.email","prospect.meetings","prospect.bookmarks","prospect.reminders"],
        where: whereParameters,
      skip: researchParamsRemindersDto.skip,
      take: researchParamsRemindersDto.take
      });

      const countRemindersDone = await this.reminderRepository.countBy(whereParameters);

      return {
        remindersDone: remindersDone,
        count: countRemindersDone
      };
    
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de récupérer les rappels", HttpStatus.INTERNAL_SERVER_ERROR);
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
      const today = new Date();
      const firstd = today.getDate() - today.getDay() + 1;

      //  ? getting the monday of the week
      const monday = new Date(today.setDate(firstd));

      // ? getting the sunday of the week
      const sunday = lastDayOfWeek(new Date(), { weekStartsOn: 1})

      // ? setting monday on midnight and sunday on 23:59:59
      monday.setHours(1,0,0,0)
      sunday.setHours(24,59,59,999)

      return await this.reminderRepository.count({
        where: {
          pm: {
            pseudo: user.pseudo
          },
          creationDate: Between(monday, sunday)
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

      //  ! begining of history
      let s = new Date("2022-11-07")
      let temp = new Date("2022-11-07")

      // ! end of history
      let ed = new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 1 + 6));
      while(s <= ed) {
       
        // ! each week sunday
        temp.setDate(temp.getDate() + 7)
        results.intervals.push({
          dateDown: new Date(s),
          dateUp: new Date(temp.setHours(0,59,59,999))
        });
        const count = await this.reminderRepository.count({
          where: {
            pm: {
              pseudo: user.pseudo
            },
            creationDate: Between(s, new Date(temp.setHours(0,59,59,999)))
          }
        })
        results.data.push(count)
        s.setDate(s.getDate() + 7)
      }
      return results
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de compter les appels par semaines", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
