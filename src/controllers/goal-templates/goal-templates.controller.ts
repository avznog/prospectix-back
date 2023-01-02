import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/annotations/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.model';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesType } from 'src/auth/role.type';
import { CreateGoalTemplateDto } from 'src/dto/goal-templates/create-goal-template.dto';
import { UpdateGoalTemplateDto } from 'src/dto/goal-templates/update-goal-template.dto';
import { GoalTemplate } from 'src/entities/goal-templates/goal-template.entity';
import { Goal } from 'src/entities/goals/goal.entity';
import { ProjectManager } from 'src/entities/project-managers/project-manager.entity';
import { SentryInterceptor } from 'src/sentry.interceptor';
import { GoalTemplatesService } from 'src/services/goal-templates/goal-templates.service';
import { SentryService } from 'src/services/sentry/sentry/sentry.service';
import { DeleteResult } from 'typeorm';

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
