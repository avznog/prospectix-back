import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NegativeAnswersService } from './negative-answers.service';
import { CreateNegativeAnswerDto } from './dto/create-negative-answer.dto';
import { UpdateNegativeAnswerDto } from './dto/update-negative-answer.dto';

@Controller('negative-answers')
export class NegativeAnswersController {
  constructor(private readonly negativeAnswersService: NegativeAnswersService) {}

  @Post()
  create(@Body() createNegativeAnswerDto: CreateNegativeAnswerDto) {
    return this.negativeAnswersService.create(createNegativeAnswerDto);
  }

  @Get()
  findAll() {
    return this.negativeAnswersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.negativeAnswersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNegativeAnswerDto: UpdateNegativeAnswerDto) {
    return this.negativeAnswersService.update(+id, updateNegativeAnswerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.negativeAnswersService.remove(+id);
  }
}
