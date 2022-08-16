import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { Event } from './entities/event.entity';

@Injectable()
export class EventsService {

  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>
  ) {}

  async create(createEventDto: CreateEventDto) : Promise<Event> {
    try {
      return this.eventRepository.save(createEventDto);
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossitble de créer l'évènement", HttpStatus.INTERNAL_SERVER_ERROR);
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
          date: "asc"
        }
      });
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de récupérer tous les évènements pour ce prospect", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
