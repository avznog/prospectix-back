import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GoalTemplatesService } from './goal-templates.service';
import { CreateGoalTemplateDto } from './dto/create-goal-template.dto';
import { UpdateGoalTemplateDto } from './dto/update-goal-template.dto';

@Controller('goal-templates')
export class GoalTemplatesController {
  constructor(private readonly goalTemplatesService: GoalTemplatesService) {}

  @Post()
  create(@Body() createGoalTemplateDto: CreateGoalTemplateDto) {
    return this.goalTemplatesService.create(createGoalTemplateDto);
  }

  @Get()
  findAll() {
    return this.goalTemplatesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.goalTemplatesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGoalTemplateDto: UpdateGoalTemplateDto) {
    return this.goalTemplatesService.update(+id, updateGoalTemplateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.goalTemplatesService.remove(+id);
  }
}
