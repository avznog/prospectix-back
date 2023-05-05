import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Email } from 'src/prospect-global/emails/entities/email.entity';
import { Repository, UpdateResult } from 'typeorm';
import { UpdateEmailDto } from './dto/update-email.dto';

@Injectable()
export class EmailsService {
  constructor(
    @InjectRepository(Email)
    private readonly emailRepository: Repository<Email>
  ) {}

  async update(idEmail: number, updateEmailDto: UpdateEmailDto) : Promise<UpdateResult> {
    try {
      return await this.emailRepository.update(idEmail, updateEmailDto);
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de modifier l'email", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
