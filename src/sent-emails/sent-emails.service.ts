import { Injectable } from '@nestjs/common';
import { CreateSentEmailDto } from './dto/create-sent-email.dto';
import { UpdateSentEmailDto } from './dto/update-sent-email.dto';

@Injectable()
export class SentEmailsService {
  create(createSentEmailDto: CreateSentEmailDto) {
    return 'This action adds a new sentEmail';
  }

  findAll() {
    return `This action returns all sentEmails`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sentEmail`;
  }

  update(id: number, updateSentEmailDto: UpdateSentEmailDto) {
    return `This action updates a #${id} sentEmail`;
  }

  remove(id: number) {
    return `This action removes a #${id} sentEmail`;
  }
}
