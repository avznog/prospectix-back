import { Body, Controller, Get, Param, Patch, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/annotations/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.model';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesType } from 'src/auth/role.type';
import { UpdateGoalDto } from 'src/dto/goals/update-goal.dto';
import { Goal } from 'src/entities/goals/goal.entity';
import { ProjectManager } from 'src/entities/project-managers/project-manager.entity';
import { SentryInterceptor } from 'src/sentry.interceptor';
import { GoalsService } from 'src/services/goals/goals.service';
import { SentryService } from 'src/services/sentry/sentry/sentry.service';

@Controller('goals')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(SentryInterceptor)
@ApiTags("goals")
export class GoalsController {
  constructor(
    private readonly goalsService: GoalsService,
    private readonly sentryService: SentryService
  ) { }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("find-all")
  findAll(@CurrentUser() user: ProjectManager) : Promise<Goal[]> {
    this.sentryService.setSentryUser(user);
    return this.goalsService.findAll();
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Patch(":id")
  update(@Param("id") id: number, @Body() updateGoalDto: UpdateGoalDto, @CurrentUser() user: ProjectManager) {
    this.sentryService.setSentryUser(user);
    return this.goalsService.update(id, updateGoalDto);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("check/:id")
  check(@Param("id") id: number, @CurrentUser() user: ProjectManager) : Promise<Goal[]> {
    this.sentryService.setSentryUser(user);
    return this.goalsService.check(id);
  }
}
