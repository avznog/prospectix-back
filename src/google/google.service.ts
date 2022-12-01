import { Injectable } from '@nestjs/common';
import { CreateGoogleDto } from './dto/create-google.dto';
import { UpdateGoogleDto } from './dto/update-google.dto';

@Injectable()
export class GoogleService {
  create(createGoogleDto: CreateGoogleDto) {
    return 'This action adds a new google';
  }

  findAll() {
    return `This action returns all google`;
  }

  findOne(id: number) {
    return `This action returns a #${id} google`;
  }

  update(id: number, updateGoogleDto: UpdateGoogleDto) {
    return `This action updates a #${id} google`;
  }

  remove(id: number) {
    return `This action removes a #${id} google`;
  }
}
