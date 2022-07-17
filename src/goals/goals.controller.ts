import { Controller, Get, Post, Body, Param, Req, UseGuards, Patch, Delete } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { ApiTags } from '@nestjs/swagger';
import RequestWithPm from 'src/auth/interfaces/requestWithPm.interface';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Goal } from './entities/goal.entity';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/annotations/roles.decorator';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller('goals')
@ApiTags("goals")
@UseGuards(JwtAuthGuard, RolesGuard)
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Roles("Admin")
  @Post("for-pm/:pseudo")
  createForPm(@Body() createGoalDto: CreateGoalDto,@Param("pseudo") pseudo: string) : Promise<Goal> {
    return this.goalsService.createForPm(createGoalDto, pseudo);
  }

  @Roles("Admin")
  @Post("for-current-pm")
  createForCurrentPm(@Body() createGoalDto: CreateGoalDto, @Req() request: RequestWithPm) : Promise<Goal> {
    request.pm = request.user as ProjectManager;
    return this.goalsService.createForCurrentPm(createGoalDto, request.pm.id);
  }

  @Roles("Cdp","Admin")
  @Get()
  findAll() : Promise<Goal[]> {
    return this.goalsService.findAll();
  }

  @Roles("Cdp","Admin") 
  @Get("by-current-pm")
  findAllByCurrentPm(@Req() request: RequestWithPm) : Promise<Goal[]> {
    request.pm = request.user as ProjectManager;
    return this.goalsService.findAllByCurrentPm(request.pm.id);
  }

  @Roles("Cdp","Admin")
  @Get("by-pm/:pseudoPm")
  findAllByPm(@Param("pseudoPm") pseudoPm: string ) : Promise<Goal[]> {
    return this.goalsService.findAllByPm(pseudoPm);
  }

  @Roles("Cdp", "Admin")
  @Get("by-title-and-current-pm/:title")
  findAllByTitleAndCurrentPm(@Param("title") title: string, @Req() request: RequestWithPm) : Promise<Goal[]> {
    request.pm = request.user as ProjectManager;
    return this.goalsService.findAllByTitleAndCurrentPm(title, request.pm.pseudo);
  }

  @Roles("Cdp", "Admin")
  @Get("by-title-and-pm/:title/:pseudoPm")
  findAllByTitleAndPm(@Param("title") title: string, @Param("pseudoPm") pseudoPm: string) : Promise<Goal[]> {
    return this.goalsService.findAllByTitleAndPm(title, pseudoPm);
  }

  @Roles("Admin")
  @Patch(":id")
  update(@Param("id") id: number, @Body() updateGoalDto: UpdateGoalDto) : Promise<UpdateResult> {
    return this.goalsService.update(id, updateGoalDto);
  }

  @Roles("Admin")
  @Delete(":id")
  delete(@Param("id") id: number) : Promise<DeleteResult> {
    return this.goalsService.delete(+id);
  }
}
