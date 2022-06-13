import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Prospect } from 'src/prospects/entities/prospect.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
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

  async findAllByPm(idPm: number) : Promise<Meeting[]>{
    try {
      return await this.meetingRepository.find({
        relations: ["pm"],
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
        relations: ["prospect"],
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

  findOne(id: number) {
    return `This action returns a #${id} meeting`;
  }

  async update(idMeeting: number, updateMeetingDto: UpdateMeetingDto) : Promise<UpdateResult> {
    const oldMeeting = await this.meetingRepository.findOne({
      where: {
        id: idMeeting
      }
    });
    return await this.meetingRepository.update(idMeeting, oldMeeting);
  }

  remove(id: number) {
    return `This action removes a #${id} meeting`;
  }
}
