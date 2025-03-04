import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SentryService } from '../../apis/sentry/sentry.service';
import { Roles } from '../../auth/annotations/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.model';
import JwtAuthGuard from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { RolesType } from '../../auth/role.type';
import { CreateGoalTemplateDto } from '../../goals-global/goal-templates/dto/create-goal-template.dto';
import { GoalTemplate } from '../../goals-global/goal-templates/entities/goal-template.entity';
import { Goal } from '../../goals-global/goals/entities/goal.entity';
import { SentryInterceptor } from '../../sentry.interceptor';
import { ProjectManager } from '../../users/project-managers/entities/project-manager.entity';
import { DeleteResult } from 'typeorm';
import { UpdateGoalTemplateDto } from './dto/update-goal-template.dto';
import { GoalTemplatesService } from './goal-templates.service';

@Controller('goal-templates')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(SentryInterceptor)
@ApiTags("goal-templates")
export class GoalTemplatesController {
  constructor(
    private readonly goalTemplatesService: GoalTemplatesService,
    private readonly sentryService: SentryService
    ) {}

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("find-all")
  findAll(@CurrentUser() user: ProjectManager) : Promise<GoalTemplate[]> {
    this.sentryService.setSentryUser(user);
    return this.goalTemplatesService.findAll();
  }

  @Roles(RolesType.ADMIN)
  @Patch(":id")
  update(@Param("id") id: number, @Body() updateGoalTemplateDto: UpdateGoalTemplateDto, @CurrentUser() user: ProjectManager) {
    this.sentryService.setSentryUser(user);
    return this.goalTemplatesService.update(id, updateGoalTemplateDto);
  }

  @Roles(RolesType.ADMIN)
  @Post()
  create(@Body() createGoalTemplateDto: CreateGoalTemplateDto, @CurrentUser() user: ProjectManager) : Promise<{goalTemplate: GoalTemplate, goals: Goal[]}> {
    this.sentryService.setSentryUser(user);
    return this.goalTemplatesService.create(createGoalTemplateDto);
  }
  
  @Roles(RolesType.ADMIN)
  @Delete(":id")
  delete(@Param("id") id: number, @CurrentUser() user: ProjectManager) : Promise<DeleteResult> {
    this.sentryService.setSentryUser(user);
    return this.goalTemplatesService.delete(id, user);
  }

}
