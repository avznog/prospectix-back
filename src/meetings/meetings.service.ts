import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MeetingType } from 'src/constants/meeting.type';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { DeleteResult, ILike, LessThan, MoreThan, Repository, UpdateResult } from 'typeorm';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { ResearchParamsMeetingsDto } from './dto/research-parmas-meetings.dto';
import { Meeting } from './entities/meeting.entity';

@Injectable()
export class MeetingsService {
  constructor(
    @InjectRepository(Meeting)
    private readonly meetingRepository: Repository<Meeting>
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

  async findAllPaginated(researchParamsMeetingsDto: ResearchParamsMeetingsDto) : Promise<Meeting[]>{
    try {
      return await this.meetingRepository.find({
        relations: ["pm", "prospect", "prospect.activity", "prospect.city", "prospect.country", "prospect.reminders", "prospect.phone", "prospect.website", "prospect.email"],
        where: [
          researchParamsMeetingsDto.type != "" && {
            type: researchParamsMeetingsDto.type as MeetingType,
            done: researchParamsMeetingsDto.done == "true" ? true : false,
            date: researchParamsMeetingsDto.date ? new Date(researchParamsMeetingsDto.date) : researchParamsMeetingsDto.oldOrNew == "old" ? LessThan(new Date()) : MoreThan(new Date()),
            prospect: [
              {
                phone: {
                  number: ILike(`%${researchParamsMeetingsDto.keyword}%`)
                }
              },
              {
                email: {
                  email: ILike(`%${researchParamsMeetingsDto.keyword}%`)
                }
              },
              {
                website: {
                  website: ILike(`%${researchParamsMeetingsDto.keyword}%`)
                }
              },
              {
                city: {
                  name: ILike(`%${researchParamsMeetingsDto.keyword}%`)
                }
              },
              {
                country: {
                  name: ILike(`%${researchParamsMeetingsDto.keyword}%`)
                }
              },
              {
                activity: {
                  name: ILike(`%${researchParamsMeetingsDto.keyword}%`)
                }
              },{
                companyName: ILike(`%${researchParamsMeetingsDto.keyword}%`)
              },
              {
                streetAddress: ILike(`%${researchParamsMeetingsDto.keyword}%`)
              },
            ]
          },

          // All meetings
          researchParamsMeetingsDto.type == "" && {
            done: researchParamsMeetingsDto.done == "true" ? true : false,
            date: researchParamsMeetingsDto.date ? new Date(researchParamsMeetingsDto.date) : researchParamsMeetingsDto.oldOrNew == "old" ? LessThan(new Date()) : MoreThan(new Date()),
            prospect: [
              {
                phone: {
                  number: ILike(`%${researchParamsMeetingsDto.keyword}%`)
                }
              },
              {
                email: {
                  email: ILike(`%${researchParamsMeetingsDto.keyword}%`)
                }
              },
              {
                website: {
                  website: ILike(`%${researchParamsMeetingsDto.keyword}%`)
                }
              },
              {
                city: {
                  name: ILike(`%${researchParamsMeetingsDto.keyword}%`)
                }
              },
              {
                country: {
                  name: ILike(`%${researchParamsMeetingsDto.keyword}%`)
                }
              },
              {
                activity: {
                  name: ILike(`%${researchParamsMeetingsDto.keyword}%`)
                }
              },{
                companyName: ILike(`%${researchParamsMeetingsDto.keyword}%`)
              },
              {
                streetAddress: ILike(`%${researchParamsMeetingsDto.keyword}%`)
              },
            ]
          },
        ],
        take: researchParamsMeetingsDto.take,
        skip: researchParamsMeetingsDto.skip
      });
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de récupérer les rendez-vous", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
