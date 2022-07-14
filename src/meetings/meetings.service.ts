import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Prospect } from 'src/prospects/entities/prospect.entity';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';
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

  async create(createMeetingDto: CreateMeetingDto, idPm: number, idProspect: number) : Promise<Meeting> {
    try {
      const pm = await this.pmRepository.findOne({
        where: {
          id: idPm
        }
      });
      if(!pm)
        throw new HttpException("Impossible de créer le rendez-vous: Chef de projet introuvable", HttpStatus.BAD_REQUEST)
      const prospect = await this.prospectRepository.findOne({
        where: {
          id: idProspect
        }
      });
      if(!prospect)
        throw new HttpException("Impossible de créer le rendez-vous: prospect introuvable", HttpStatus.BAD_REQUEST)
      createMeetingDto.pm = pm;
      createMeetingDto.prospect = prospect;
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
      })
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

  async findAllByKeyword(keyword: string) : Promise<Meeting[]> {
    try {
      return await this.meetingRepository.find({
        relations: ["pm", "prospect", "prospect.activity", "prospect.city", "prospect.country", "prospect.reminders", "prospect.phone", "prospect.website", "prospect.email"],
        where: [
          {
            prospect: {
              companyName: Like(`%${keyword}%`),
            }
          },
          {
            prospect: {
              city: {
                name: Like(`%${keyword}%`),
              }
            }
          },
          {
            prospect: {
              activity: {
                name: Like(`%${keyword}%`),
              }
            }
          },
          {
            prospect: {
              country: {
                name: Like(`%${keyword}%`)
              }
            }
          },
          {
            prospect: {
              phone: {
                number: Like(`%${keyword}%`)
              }
            }
          },
          {
            prospect: {
              website: {
                website: Like(`%${keyword}%`)
              }
            }
          },
          {
            prospect: {
              email: {
                email: Like(`%${keyword}%`)
              }
            }
          }
        ]
      })
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de récupérer les rendez-vous", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
