import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/annotations/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.model';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesType } from 'src/auth/role.type';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateGoalDto } from './dto/create-goal.dto';
import { ResearchParamsGoalsDto } from './dto/research-params-goals.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { Goal } from './entities/goal.entity';
import { GoalsService } from './goals.service';

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

  @Roles(RolesType.CDP,  RolesType.ADMIN)
  @Get("find-all-paginated")
  findAllPaginated(@Query() researchParamsGoalsDto: ResearchParamsGoalsDto) : Promise<Goal[]> {
    return this.goalsService.findAllPaginated(researchParamsGoalsDto);
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
