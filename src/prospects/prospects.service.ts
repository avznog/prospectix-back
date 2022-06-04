import { Injectable } from '@nestjs/common';
import { CreateProspectDto } from './dto/create-prospect.dto';
import { UpdateProspectDto } from './dto/update-prospect.dto';

@Injectable()
export class ProspectsService {
  create(createProspectDto: CreateProspectDto) {
    return 'This action adds a new prospect';
  }

  findAll() {
    return `This action returns all prospects`;
  }

  findOne(id: number) {
    return `This action returns a #${id} prospect`;
  }

  update(id: number, updateProspectDto: UpdateProspectDto) {
    return `This action updates a #${id} prospect`;
  }

  remove(id: number) {
    return `This action removes a #${id} prospect`;
  }
}
