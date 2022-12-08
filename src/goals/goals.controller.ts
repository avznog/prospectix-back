import { Body, Controller, Get, Param, Patch, UseGuards, UseInterceptors } from '@nestjs/common';
import { Roles } from 'src/auth/annotations/roles.decorator';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesType } from 'src/auth/role.type';
import { SentryInterceptor } from 'src/sentry.interceptor';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { Goal } from './entities/goal.entity';
import { GoalsService } from './goals.service';

@Controller('goals')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(SentryInterceptor)
export class GoalsController {
  constructor(
    private readonly goalsService: GoalsService
  ) { }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("find-all")
  findAll() : Promise<Goal[]> {
    return this.goalsService.findAll();
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Patch(":id")
  update(@Param("id") id: number, @Body() updateGoalDto: UpdateGoalDto) {
    return this.goalsService.update(id, updateGoalDto);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("check/:id")
  check(@Param("id") id: number) : Promise<Goal[]> {
    return this.goalsService.check(id);
  }
}
