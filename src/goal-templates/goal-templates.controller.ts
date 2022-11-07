import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/annotations/roles.decorator';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesType } from 'src/auth/role.type';
import { Goal } from 'src/goals/entities/goal.entity';
import { CreateGoalTemplateDto } from './dto/create-goal-template.dto';
import { UpdateGoalTemplateDto } from './dto/update-goal-template.dto';
import { GoalTemplate } from './entities/goal-template.entity';
import { GoalTemplatesService } from './goal-templates.service';

@Controller('goal-templates')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GoalTemplatesController {
  constructor(
    private readonly goalTemplatesService: GoalTemplatesService
    ) {}

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("find-all")
  findAll() : Promise<GoalTemplate[]> {
    return this.goalTemplatesService.findAll();
  }

  @Roles(RolesType.ADMIN)
  @Patch(":id")
  update(@Param("id") id: number, @Body() updateGoalTemplateDto: UpdateGoalTemplateDto) {
    return this.goalTemplatesService.update(id, updateGoalTemplateDto);
  }

  @Roles(RolesType.ADMIN)
  @Post()
  create(@Body() createGoalTemplateDto: CreateGoalTemplateDto) : Promise<{goalTemplate: GoalTemplate, goals: Goal[]}> {
    return this.goalTemplatesService.create(createGoalTemplateDto);
  }
  
}
