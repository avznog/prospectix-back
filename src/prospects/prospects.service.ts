import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateProspectDto } from './dto/create-prospect.dto';
import { UpdateProspectDto } from './dto/update-prospect.dto';
import { Prospect } from './entities/prospect.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProspectsService {
  constructor(
    @InjectRepository(Prospect)
    private readonly prospectRepository: Repository<Prospect>,
  ) {}

  async create(createProspectDto: CreateProspectDto) {
    const prospect = await this.prospectRepository.findOne({
      where: {
        companyName: createProspectDto.companyName,
      },
    });
    if (!prospect)
      throw new HttpException(
        'Prospect does not exist yet.',
        HttpStatus.NOT_FOUND,
      );
    createProspectDto = prospect;
    return await this.prospectRepository.save(createProspectDto);
  }

  async findAll() {
    return await this.findAll();
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
