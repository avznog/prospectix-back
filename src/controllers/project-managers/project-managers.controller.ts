import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/annotations/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.model';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesType } from 'src/auth/role.type';
import { CreateProjectManagerDto } from 'src/dto/project-managers/create-project-manager.dto';
import { ResearchParamsProjectManagersDto } from 'src/dto/project-managers/research-params-project-managers.dto';
import { UpdateProjectManagerDto } from 'src/dto/project-managers/update-project-manager.dto';
import { ProjectManager } from 'src/entities/project-managers/project-manager.entity';
import { SentryInterceptor } from 'src/sentry.interceptor';
import { ProjectManagersService } from 'src/services/project-managers/project-managers.service';
import { SentryService } from 'src/services/sentry/sentry/sentry.service';
import { UpdateResult } from 'typeorm';

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
  @Roles(RolesType.ADMIN)
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
}