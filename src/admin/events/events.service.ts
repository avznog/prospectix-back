import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEventDto } from 'src/admin/events/dto/create-event.dto';
import { ProjectManager } from 'src/users/project-managers/entities/project-manager.entity';
import { Repository } from 'typeorm';
import { Event } from 'src/admin/events/entities/event.entity';
import moment from 'moment';
@Injectable()
export class EventsService {

  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>
  ) {}

  async create(createEventDto: CreateEventDto, user: ProjectManager) : Promise<Event> {
    try {
      createEventDto.date = moment(createEventDto.date).tz('Europe/Paris').toDate();
      createEventDto.pm = user;
      return this.eventRepository.save(createEventDto);
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de créer l'évènement", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAllByProspect(prospectId: number) : Promise<Event[]> {
    try {
      return this.eventRepository.find({
        relations: ["pm","prospect"],
        where: {
          prospect: {
            id: prospectId
          }
        },
        order: {
          date: "DESC"
        }
      });
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de récupérer tous les évènements pour ce prospect", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
