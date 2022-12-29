import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateEmailDto } from 'src/dto/emails/update-email.dto';
import { Email } from 'src/entities/emails/email.entity';
import { Repository, UpdateResult } from 'typeorm';

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
