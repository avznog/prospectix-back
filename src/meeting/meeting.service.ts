import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { Meeting } from './entities/meeting.entity';

@Injectable()
export class MeetingService {
  constructor(
    @InjectRepository(Meeting)
    private readonly meetingRepository: Repository<Meeting>
  ){}
  create(createMeetingDto: CreateMeetingDto) {
    const meeting = this.meetingRepository.create(createMeetingDto);
    const m = this.meetingRepository.save(createMeetingDto);
    return meeting;
  }

  findAll() {
    const meetings = this.meetingRepository.find({where: {type: "benjamin"}});
    return meetings;
  }

  findOne(id: number) {

    return `This action returns a #${id} meeting`;
  }

  update(id: number, updateMeetingDto: UpdateMeetingDto) {
    return `This action updates a #${id} meeting`;
  }

  remove(id: number) {
    return `This action removes a #${id} meeting`;
  }
}
