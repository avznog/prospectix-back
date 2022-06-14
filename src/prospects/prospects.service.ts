import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProspectDto } from './dto/create-prospect.dto';
import { UpdateProspectDto } from './dto/update-prospect.dto';
import { Prospect } from './entities/prospect.entity';

@Injectable()
export class ProspectsService {
  constructor(
    @InjectRepository(Prospect)
    private readonly prospectRepository: Repository<Prospect>
  ){}
  
  create(createProspectDto: CreateProspectDto) {
    return 'This action adds a new prospect';
  }

  findAll() {
    return `This action returns all prospects`;
  }

  async findOne(id: number) : Promise<Prospect> {
    return await this.prospectRepository.findOne({
      where: {
        id: id
      }
    })
  }

  update(id: number, updateProspectDto: UpdateProspectDto) {
    return `This action updates a #${id} prospect`;
  }

  remove(id: number) {
    return `This action removes a #${id} prospect`;
  }
}
