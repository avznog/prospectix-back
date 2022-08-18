import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MeetingType } from 'src/constants/meeting.type';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Prospect } from 'src/prospects/entities/prospect.entity';
import { DeleteResult, ILike, LessThan, Like, MoreThan, Repository, UpdateResult } from 'typeorm';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { Meeting } from './entities/meeting.entity';

@Injectable()
export class MeetingsService {
  constructor(
    @InjectRepository(Meeting)
    private readonly meetingRepository: Repository<Meeting>,

    @InjectRepository(Prospect)
    private readonly prospectRepository: Repository<Prospect>,

    @InjectRepository(ProjectManager)
    private readonly pmRepository: Repository<ProjectManager>
  ){}

  async create(createMeetingDto: CreateMeetingDto, user: ProjectManager) : Promise<Meeting> {
    try {
      createMeetingDto.pm = user;
      return await this.meetingRepository.save(createMeetingDto);
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de créer le rendez-vous", HttpStatus.INTERNAL_SERVER_ERROR)
    }
    
  }

  async findAllByCurrentPm(idPm: number) : Promise<Meeting[]>{
    try {
      return await this.meetingRepository.find({
        relations: ["pm", "prospect", "prospect.activity", "prospect.city", "prospect.country", "prospect.reminders", "prospect.phone", "prospect.website", "prospect.email"],
        where: {
          pm: {
            id: idPm
          }
        }
      });
    } catch (error) {
      console.log(error);
      throw new HttpException("Impossible de récupérer les rendez-vous pour le Chef de projet sélectionné", HttpStatus.BAD_REQUEST)
    }
  }

  async findAllByProspect(idProspect: number) : Promise<Meeting[]> {
    try{
      return await this.meetingRepository.find({
        relations: ["pm", "prospect", "prospect.activity", "prospect.city", "prospect.country", "prospect.reminders", "prospect.phone", "prospect.website", "prospect.email"],
        where: {
          prospect: {
            id: idProspect
          }
        }
      });
    }catch (error) {
      console.log(error);
      throw new HttpException("Impossible de récupérer les rendez-vous pour le prospect sélectionné", HttpStatus.BAD_REQUEST)
    }
    
  }

  async findAll() : Promise<Meeting[]> {
    try {
      return await this.meetingRepository.find({
        relations: ["pm", "prospect", "prospect.activity", "prospect.city", "prospect.country", "prospect.reminders", "prospect.phone", "prospect.website", "prospect.email"],
      }); 
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de récupérer l'entièreté des rendez-vous", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(idMeeting: number) : Promise<DeleteResult> {
    try {
      return await this.meetingRepository.delete(idMeeting);
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de supprimer le rendez-vous", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async markDone(idMeeting: number) : Promise<UpdateResult> {
    try {
      return await this.meetingRepository.update(idMeeting, { done: true });
    } catch (error) {
      console.log(error);
      throw new HttpException("Impossible de marquer le rendez-vous comme fait", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async markUndone(idMeeting: number) : Promise<UpdateResult> {
    try {
      return await this.meetingRepository.update(idMeeting, { done: false });
    } catch (error) {
      console.log(error);
      throw new HttpException("Impossible de marquer le rendez vous comme n'étant pas encore fait", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAllPaginated(take: number, skip: number, done: string, date: string, oldOrNew: string, keyword: string, type: string) : Promise<Meeting[]>{
    try {
      return await this.meetingRepository.find({
        relations: ["pm", "prospect", "prospect.activity", "prospect.city", "prospect.country", "prospect.reminders", "prospect.phone", "prospect.website", "prospect.email"],
        where: [
          
          // WITH DATE 
          // Meeting has a type
          type != "" && {
            type: type as MeetingType,
            done: done == "true" ? true : false,
            date: date ? new Date(date) : oldOrNew == "old" ? LessThan(new Date()) : MoreThan(new Date()),
            prospect: [
              {
                phone: {
                  number: ILike(`%${keyword}%`)
                }
              },
              {
                email: {
                  email: ILike(`%${keyword}%`)
                }
              },
              {
                website: {
                  website: ILike(`%${keyword}%`)
                }
              },
              {
                city: {
                  name: ILike(`%${keyword}%`)
                }
              },
              {
                country: {
                  name: ILike(`%${keyword}%`)
                }
              },
              {
                activity: {
                  name: ILike(`%${keyword}%`)
                }
              },{
                companyName: ILike(`%${keyword}%`)
              },
              {
                streetAddress: ILike(`%${keyword}%`)
              },
            ]
          },

          // All meetings
          type == "" && {
            done: done == "true" ? true : false,
            date: date ? new Date(date) : oldOrNew == "old" ? LessThan(new Date()) : MoreThan(new Date()),
            prospect: [
              {
                phone: {
                  number: ILike(`%${keyword}%`)
                }
              },
              {
                email: {
                  email: ILike(`%${keyword}%`)
                }
              },
              {
                website: {
                  website: ILike(`%${keyword}%`)
                }
              },
              {
                city: {
                  name: ILike(`%${keyword}%`)
                }
              },
              {
                country: {
                  name: ILike(`%${keyword}%`)
                }
              },
              {
                activity: {
                  name: ILike(`%${keyword}%`)
                }
              },{
                companyName: ILike(`%${keyword}%`)
              },
              {
                streetAddress: ILike(`%${keyword}%`)
              },
            ]
          },
        ],
        take: take,
        skip: skip
      });
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de récupérer les rendez-vous", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
