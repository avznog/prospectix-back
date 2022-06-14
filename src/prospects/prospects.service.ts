import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateProspectDto } from './dto/create-prospect.dto';
import { UpdateProspectDto } from './dto/update-prospect.dto';
import { Prospect } from './entities/prospect.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Phone } from 'src/phones/entities/phone.entity';
import { Email } from 'src/emails/entities/email.entity';
import { Website } from 'src/websites/entities/website.entity';
import { City } from 'src/cities/entities/city.entity';
import { Country } from 'src/countries/entities/country.entity';
import { Meeting } from 'src/meetings/entities/meeting.entity';
import { Reminder } from 'src/reminders/entities/reminder.entity';
import { Bookmark } from 'src/bookmarks/entities/bookmark.entity';
import { Activity } from 'src/activities/entities/activity.entity';

@Injectable()
export class ProspectsService {
  async create(createProspectDto: CreateProspectDto) {
    const prospect = await Prospect.findOne({
      where: {
        companyName: createProspectDto.companyName,
      },
    });
    if (!prospect)
      throw new HttpException(
        'Prospect does not exist yet.',
        HttpStatus.NOT_FOUND,
      );
    return await Prospect.save(createProspectDto);
  }

  async findAll() {
    return await this.findAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} prospect`;
  }

  async findAllByActivity(activityName: string) {
    try {
      const activity = await Activity.findOne({
        where: {
          name: activityName,
        },
      });

      return await Prospect.find({
        where: {
          activity: activity,
        },
      });
    } catch (error) {
      throw new HttpException(
        'Aucun prospect pour cette activité',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  //find by activity

  //find by activities

  //find by city

  //find by cities

  //find by pm

  //find by phone

  //find by website

  //find by adress

  //find by find by mail

  async update(id: number, updateProspectDto: UpdateProspectDto) {
    return `This action updates a #${id} prospect`;
  }

  async remove(id: number) {
    return `This action removes a #${id} prospect`;
  }
}
