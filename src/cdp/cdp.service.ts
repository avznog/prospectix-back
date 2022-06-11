import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateCdpDto } from './dto/create-cdp.dto';
import { UpdateCdpDto } from './dto/update-cdp.dto';
import { Cdp } from './entities/cdp.entity';
import { InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class CdpService {
  constructor(
    @InjectRepository(Cdp)
    private cdpRepository: Repository<Cdp>
  ){}
  create(createCdpDto: CreateCdpDto) {
    return this.cdpRepository.create(createCdpDto);
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
