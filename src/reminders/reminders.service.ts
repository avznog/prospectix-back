import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { InjectRepository} from "@nestjs/typeorm";
import { DeleteResult, ILike, LessThan, Like, MoreThan, Repository, UpdateResult } from 'typeorm';
import { Reminder } from './entities/reminder.entity';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Prospect } from 'src/prospects/entities/prospect.entity';
import { ResearchParamsRemindersDto } from './dto/research-params-reminders.dto';

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
  
  async findAll() : Promise<Reminder[]> {
    try {
      return await this.reminderRepository.find({
        relations: ["pm", "prospect", "prospect.activity", "prospect.city", "prospect.country", "prospect.meetings", "prospect.phone", "prospect.website", "prospect.email"],
      });
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de récupérer la totalité des rappels", HttpStatus.INTERNAL_SERVER_ERROR);
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

  async findAllByCurrentPm(idPm: number) : Promise<Reminder[]>{
    try{
      return await this.reminderRepository.find({
        relations: ["pm", "prospect", "prospect.activity", "prospect.city", "prospect.country", "prospect.meetings", "prospect.phone", "prospect.website", "prospect.email"],
        where: {
          pm: {
            id: idPm
          },
        }
      });
    } catch (error){
      throw new HttpException("Le Cdp n'existe pas dans la base de données", HttpStatus.BAD_REQUEST)
    }
    
  }

  async findAllByPm(pseudpPm: string) : Promise<Reminder[]> {
    try{
      return await this.reminderRepository.find({
        relations: ["pm", "prospect", "prospect.activity", "prospect.city", "prospect.country", "prospect.meetings", "prospect.phone", "prospect.website", "prospect.email"],
        where: {
          pm: {
            pseudo: pseudpPm
          }
        }
      });
    } catch(error){
      console.log(error)
      throw new HttpException("Impossible de trouver les rappels pour le chef de projet sélectionné", HttpStatus.NOT_FOUND);
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

  async markUnDone(idReminder: number) : Promise<UpdateResult> {
    try {
      return await this.reminderRepository.update(idReminder, { done : false })
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de ractiver le rappel", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  async findAllPaginated(researchParamsRemindersDto: ResearchParamsRemindersDto) : Promise<Reminder[]> {
    try {
      return await this.reminderRepository.find({
        relations: ["pm", "prospect","prospect.phone","prospect.email", "prospect.activity"],
        where: [  
          researchParamsRemindersDto.date && {
            priority: ((researchParamsRemindersDto.priority == 0) && (1 || 2 || 3) )|| researchParamsRemindersDto.priority,
            done: researchParamsRemindersDto.done == "true" ? true : false,
            date: new Date(researchParamsRemindersDto.date),
            pm: {
              pseudo: ILike(`%${researchParamsRemindersDto.keyword}%`)
            }
          },
          researchParamsRemindersDto.date && {
            priority: ((researchParamsRemindersDto.priority == 0) && (1 || 2 || 3) )|| researchParamsRemindersDto.priority,
          done: researchParamsRemindersDto.done == "true" ? true : false,
          date: new Date(researchParamsRemindersDto.date),
          prospect: [
            {
              phone: {
                number: ILike(`%${researchParamsRemindersDto.keyword}%`)
              }
            },
            {
              email: {
                email: ILike(`%${researchParamsRemindersDto.keyword}%`)
              }
            },
            {
              website: {
                website: ILike(`%${researchParamsRemindersDto.keyword}%`)
              }
            },
            {
              city: {
                name: ILike(`%${researchParamsRemindersDto.keyword}%`)
              }
            },
            {
              country: {
                name: ILike(`%${researchParamsRemindersDto.keyword}%`)
              }
            },
            {
              activity: {
                name: ILike(`%${researchParamsRemindersDto.keyword}%`)
              }
            },{
              companyName: ILike(`%${researchParamsRemindersDto.keyword}%`)
            },
            {
              streetAddress: ILike(`%${researchParamsRemindersDto.keyword}%`)
            },
          ]
        },
        !researchParamsRemindersDto.date && {
          priority: ((researchParamsRemindersDto.priority == 0) && (1 || 2 || 3) )|| researchParamsRemindersDto.priority,
          done: researchParamsRemindersDto.done == "true" ? true : false,
          date: researchParamsRemindersDto.oldOrNew == "old" ?  LessThan(new Date()) : MoreThan(new Date()),
          pm: {
            pseudo: ILike(`%${researchParamsRemindersDto.keyword}%`)
          }
        },
        !researchParamsRemindersDto.date && {
          priority: ((researchParamsRemindersDto.priority == 0 && 1) || (1 || 2 || 3) )|| researchParamsRemindersDto.priority,
          done: researchParamsRemindersDto.done == "true" ? true : false,
          date: researchParamsRemindersDto.oldOrNew == "old" ?  LessThan(new Date()) : MoreThan(new Date()),
          prospect: [
            {
              phone: {
                number: ILike(`%${researchParamsRemindersDto.keyword}%`)
              }
            },
            {
              email: {
                email: ILike(`%${researchParamsRemindersDto.keyword}%`)
              }
            },
            {
              website: {
                website: ILike(`%${researchParamsRemindersDto.keyword}%`)
              }
            },
            {
              city: {
                name: ILike(`%${researchParamsRemindersDto.keyword}%`)
              }
            },
            {
              country: {
                name: ILike(`%${researchParamsRemindersDto.keyword}%`)
              }
            },
            {
              activity: {
                name: ILike(`%${researchParamsRemindersDto.keyword}%`)
              }
            },{
              companyName: ILike(`%${researchParamsRemindersDto.keyword}%`)
            },
            {
              streetAddress: ILike(`%${researchParamsRemindersDto.keyword}%`)
            },
          ]
        }
      ],
        take: researchParamsRemindersDto.take,
        skip: researchParamsRemindersDto.skip,
        order: (
          researchParamsRemindersDto.orderByPriority == "true" && {
          'priority': 'DESC'
        }
        ) || (
          researchParamsRemindersDto.orderByPriority == "false" && {
          'id': 'ASC'
        }
        )
      });
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de récupérer les rappels", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
