import { Controller, Get, Post, Body, Param, Req, UseGuards, Patch, Delete } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { ApiTags } from '@nestjs/swagger';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Goal } from './entities/goal.entity';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/annotations/roles.decorator';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CurrentUser } from 'src/auth/decorators/current-user.model';
import { RolesType } from 'src/auth/role.type';

@Controller('goals')
@ApiTags("goals")
@UseGuards(JwtAuthGuard, RolesGuard)
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Roles(RolesType.ADMIN)
  @Post("for-pm/:pseudo")
  createForPm(@Body() createGoalDto: CreateGoalDto,@Param("pseudo") pseudo: string) : Promise<Goal> {
    return this.goalsService.createForPm(createGoalDto, pseudo);
  }

  @Roles(RolesType.ADMIN)
  @Post("for-current-pm")
  createForCurrentPm(@Body() createGoalDto: CreateGoalDto, @CurrentUser() user) : Promise<Goal> {
    return this.goalsService.createForCurrentPm(createGoalDto, user.id);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get()
  findAll() : Promise<Goal[]> {
    return this.goalsService.findAll();
  }

  @Roles(RolesType.CDP, RolesType.ADMIN) 
  @Get("by-current-pm")
  findAllByCurrentPm(@CurrentUser() user) : Promise<Goal[]> {
    return this.goalsService.findAllByCurrentPm(user.id);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("by-pm/:pseudoPm")
  findAllByPm(@Param("pseudoPm") pseudoPm: string ) : Promise<Goal[]> {
    return this.goalsService.findAllByPm(pseudoPm);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("by-title-and-current-pm/:title")
  findAllByTitleAndCurrentPm(@Param("title") title: string, @CurrentUser() user) : Promise<Goal[]> {
    return this.goalsService.findAllByTitleAndCurrentPm(title, user.pseudo);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("by-title-and-pm/:title/:pseudoPm")
  findAllByTitleAndPm(@Param("title") title: string, @Param("pseudoPm") pseudoPm: string) : Promise<Goal[]> {
    return this.goalsService.findAllByTitleAndPm(title, pseudoPm);
  }

  @Roles(RolesType.ADMIN)
  @Patch(":id")
  update(@Param("id") id: number, @Body() updateGoalDto: UpdateGoalDto) : Promise<UpdateResult> {
    return this.goalsService.update(id, updateGoalDto);
  }

  @Roles(RolesType.ADMIN)
  @Delete(":id")
  delete(@Param("id") id: number) : Promise<DeleteResult> {
    return this.goalsService.delete(+id);
  }
}
