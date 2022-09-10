import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MeetingType } from 'src/constants/meeting.type';
import { StageType } from 'src/constants/stage.type';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { DeleteResult, ILike, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Repository, UpdateResult } from 'typeorm';
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

  async findAllPaginated(researchParamsMeetingsDto: ResearchParamsMeetingsDto, user: ProjectManager) : Promise<Meeting[]>{
    try {
      return await this.meetingRepository.find({
        relations: ["pm", "prospect", "prospect.activity", "prospect.city", "prospect.country", "prospect.reminders", "prospect.phone", "prospect.website", "prospect.email"],
        where: [

          researchParamsMeetingsDto.type != "" && {
            prospect: {
              stage: StageType.MEETING
            },
            pm: {
              pseudo: user.pseudo
            },
            done: researchParamsMeetingsDto.done  == "true" ? true : false,
            date: researchParamsMeetingsDto.oldOrNew == "old" ? LessThanOrEqual(new Date()) : MoreThan(new Date()),
            type: researchParamsMeetingsDto.type as MeetingType
          },
          researchParamsMeetingsDto.type == "" && {
            prospect: {
              stage: StageType.MEETING
            },
            pm: {
              pseudo: user.pseudo
            },
            done: researchParamsMeetingsDto.done  == "true" ? true : false,
            date: researchParamsMeetingsDto.oldOrNew == "old" ? LessThanOrEqual(new Date()) : MoreThan(new Date()),
          }
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
