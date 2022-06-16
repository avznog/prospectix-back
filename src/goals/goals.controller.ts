import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { ApiTags } from '@nestjs/swagger';
import RequestWithPm from 'src/auth/interfaces/requestWithPm.interface';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Goal } from './entities/goal.entity';

@Controller('goals')
@ApiTags("goals")
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Post()
  create(@Body() createGoalDto: CreateGoalDto, @Req() request: RequestWithPm) : Promise<Goal> {
    request.pm = request.user as ProjectManager;
    return this.goalsService.create(createGoalDto, request.pm.id);
  }

  @Get()
  findAll() : Promise<Goal[]> {
    return this.goalsService.findAll();
  }

  @Get("by-current-pm")
  findAllByCurrentPm(@Req() request: RequestWithPm) : Promise<Goal[]> {
    request.pm = request.user as ProjectManager;
    return this.goalsService.findAllByCurrentPm(request.pm.id);
  }

  @Get("by-pm/:pseudoPm")
  findAllByPm(@Param("pseudoPm") pseudoPm: string ) : Promise<Goal[]> {
    return this.goalsService.findAllByPm(pseudoPm);
  }

  @Get("by-title-and-current-pm/:title")
  findAllByTitleAndCurrentPm(@Param("title") title: string, @Req() request: RequestWithPm) : Promise<Goal[]> {
    request.pm = request.user as ProjectManager;
    return this.goalsService.findAllByTitleAndCurrentPm(title, request.pm.pseudo);
  }

  @Get("by-title-and-pm/:title/:pseudoPm")
  findAllByTitleAndPm(@Param("title") title: string, @Param("pseudoPm") pseudoPm: string) : Promise<Goal[]> {
    return this.goalsService.findAllByTitleAndPm(title, pseudoPm);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.goalsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGoalDto: UpdateGoalDto) {
    return this.goalsService.update(+id, updateGoalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.goalsService.remove(+id);
  }
}
