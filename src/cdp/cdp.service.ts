import { Injectable } from '@nestjs/common';
import { CreateCdpDto } from './dto/create-cdp.dto';
import { UpdateCdpDto } from './dto/update-cdp.dto';

@Injectable()
export class CdpService {
  create(createCdpDto: CreateCdpDto) {
    return 'This action adds a new cdp';
  }

  findAll() {
    return `This action returns all cdp`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cdp`;
  }

  update(id: number, updateCdpDto: UpdateCdpDto) {
    return `This action updates a #${id} cdp`;
  }

  remove(id: number) {
    return `This action removes a #${id} cdp`;
  }
}
