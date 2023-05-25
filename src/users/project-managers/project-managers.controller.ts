import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/annotations/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.model';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesType } from 'src/auth/role.type';
import { CreateProjectManagerDto } from 'src/users/project-managers/dto/create-project-manager.dto';
import { ProjectManager } from 'src/users/project-managers/entities/project-manager.entity';
import { SentryInterceptor } from 'src/sentry.interceptor';

import { UpdateResult } from 'typeorm';
import { SentryService } from 'src/apis/sentry/sentry.service';
import { ResearchParamsProjectManagersDto } from './dto/research-params-project-managers.dto';
import { UpdateProjectManagerDto } from './dto/update-project-manager.dto';
import { ProjectManagersService } from './project-managers.service';

@UseInterceptors(SentryInterceptor)
@Controller('project-managers')
@ApiTags('project-managers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectManagersController {
  constructor(
    private readonly pmService: ProjectManagersService,
    private readonly sentryService: SentryService
    ) {}

  @Post()
  @Roles(RolesType.ADMIN)
  create(@Body() createProjectManagerDto: CreateProjectManagerDto, @CurrentUser() user: ProjectManager) : Promise<ProjectManager> {
    this.sentryService.setSentryUser(user);
    return this.pmService.create(createProjectManagerDto);
  }

  @Get("findAll")
  @Roles(RolesType.CDP, RolesType.ADMIN)
  findAll(@CurrentUser() user: ProjectManager) : Promise<ProjectManager[]> {
    this.sentryService.setSentryUser(user);
    return this.pmService.findAll();
  }

  @Get("me")
  @Roles(RolesType.CDP, RolesType.ADMIN)
  me(@CurrentUser() user: ProjectManager) : ProjectManager {
    this.sentryService.setSentryUser(user);
    return user;
  }

  @Get("find-all-paginated")
  @Roles(RolesType.CDP, RolesType.ADMIN)
  findAllPaginated(@Query() researchParamsProjectManagersDto: ResearchParamsProjectManagersDto, @CurrentUser() user: ProjectManager) : Promise<ProjectManager[]> {
    this.sentryService.setSentryUser(user);
    return this.pmService.findAllPaginated(researchParamsProjectManagersDto);
  }

  @Patch(":id")
  @Roles(RolesType.ADMIN, RolesType.CDP)
  update(@Param("id") id: number, @Body() updateProjectManagerDto: UpdateProjectManagerDto, @CurrentUser() user: ProjectManager) : Promise<UpdateResult> {
    this.sentryService.setSentryUser(user);
    return this.pmService.update(id, updateProjectManagerDto);
  }

  @Patch("disable/:id")
  @Roles(RolesType.ADMIN)
  disable(@Param("id") id: number, @CurrentUser() user: ProjectManager) : Promise<UpdateResult> {
    this.sentryService.setSentryUser(user);
    return this.pmService.disable(id);
  }

  @Patch("enable/:id")
  @Roles(RolesType.ADMIN)
  enable(@Param("id") id : number, @CurrentUser() user: ProjectManager) : Promise<UpdateResult> {
    this.sentryService.setSentryUser(user);
    return this.pmService.enable(id);
  }

  // find all projectmanagers who we can give a meeting to
  @Get("find-all-for-meetings")
  @Roles(RolesType.CDP, RolesType.ADMIN)
  findAllForMeetings(@CurrentUser() user: ProjectManager) : Promise<ProjectManager[]> {
    this.sentryService.setSentryUser(user);
    return this.pmService.findAllForMeetings();
  } 
}
