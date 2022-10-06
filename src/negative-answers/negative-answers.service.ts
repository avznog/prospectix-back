import { Injectable } from '@nestjs/common';
import { CreateNegativeAnswerDto } from './dto/create-negative-answer.dto';
import { UpdateNegativeAnswerDto } from './dto/update-negative-answer.dto';

@Injectable()
export class NegativeAnswersService {
  create(createNegativeAnswerDto: CreateNegativeAnswerDto) {
    return 'This action adds a new negativeAnswer';
  }

  findAll() {
    return `This action returns all negativeAnswers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} negativeAnswer`;
  }

  update(id: number, updateNegativeAnswerDto: UpdateNegativeAnswerDto) {
    return `This action updates a #${id} negativeAnswer`;
  }

  remove(id: number) {
    return `This action removes a #${id} negativeAnswer`;
  }
}
