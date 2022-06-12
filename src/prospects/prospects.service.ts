import { Injectable } from '@nestjs/common';
import { CreateProspectDto } from './dto/create-prospect.dto';
import { UpdateProspectDto } from './dto/update-prospect.dto';

@Injectable()
export class ProspectsService {
  constructor(
    private readonly prospectsRepository: ProspectsRepository,
    
  )

  async create(createProspectDto: CreateProspectDto) {
    return 'This action adds a new prospect';
  }

  async findAll() {
    return await this.
  }

  async findOne(id: number) {
    return `This action returns a #${id} prospect`;
  }

  async update(id: number, updateProspectDto: UpdateProspectDto) {
    return `This action updates a #${id} prospect`;
  }

  async remove(id: number) {
    return `This action removes a #${id} prospect`;
  }
}
