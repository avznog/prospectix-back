import { Injectable } from '@nestjs/common';
import { CreateGoalTemplateDto } from './dto/create-goal-template.dto';
import { UpdateGoalTemplateDto } from './dto/update-goal-template.dto';

@Injectable()
export class GoalTemplatesService {
  create(createGoalTemplateDto: CreateGoalTemplateDto) {
    return 'This action adds a new goalTemplate';
  }

  findAll() {
    return `This action returns all goalTemplates`;
  }

  findOne(id: number) {
    return `This action returns a #${id} goalTemplate`;
  }

  update(id: number, updateGoalTemplateDto: UpdateGoalTemplateDto) {
    return `This action updates a #${id} goalTemplate`;
  }

  remove(id: number) {
    return `This action removes a #${id} goalTemplate`;
  }
}
