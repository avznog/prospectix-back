import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { Phone } from './entities/phone.entity';

@Injectable()
export class PhonesService {
  constructor(
    @InjectRepository(Phone)
    private readonly phoneRepository: Repository<Phone>
  ) {}

  async update(idPhone: number, updatePhoneDto: UpdatePhoneDto) : Promise<UpdateResult> {
    try{
      return await this.phoneRepository.update(idPhone, updatePhoneDto);
    } catch(error) {
      console.log(error)
      throw new HttpException("Impossible de modifier le numéro de telephone", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
