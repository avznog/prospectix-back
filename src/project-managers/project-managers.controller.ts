import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/annotations/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.model';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesType } from 'src/auth/role.type';
import { SentryInterceptor } from 'src/sentry.interceptor';
import { UpdateResult } from 'typeorm';
import { CreateProjectManagerDto } from './dto/create-project-manager.dto';
import { ResearchParamsProjectManagersDto } from './dto/research-params-project-managers.dto';
import { UpdateProjectManagerDto } from './dto/update-project-manager.dto';
import { ProjectManager } from './entities/project-manager.entity';
import { ProjectManagersService } from './project-managers.service';

@UseInterceptors(SentryInterceptor)
@Controller('project-managers')
@ApiTags('project-managers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectManagersController {
  constructor(private readonly pmService: ProjectManagersService) {}

  @Post()
  @Roles(RolesType.ADMIN)
  create(@Body() createProjectManagerDto: CreateProjectManagerDto) : Promise<ProjectManager> {
    return this.pmService.create(createProjectManagerDto);
  }

  @Get("findAll")
  @Roles(RolesType.CDP, RolesType.ADMIN)
  findAll() : Promise<ProjectManager[]> {
    return this.pmService.findAll();
  }

  @Get("me")
  @Roles(RolesType.CDP, RolesType.ADMIN)
  me(@CurrentUser() user: ProjectManager) : ProjectManager {
    return user;
  }

  @Get("find-all-paginated")
  @Roles(RolesType.CDP, RolesType.ADMIN)
  findAllPaginated(@Query() researchParamsProjectManagersDto: ResearchParamsProjectManagersDto) : Promise<ProjectManager[]> {
    return this.pmService.findAllPaginated(researchParamsProjectManagersDto);
  }

  @Patch(":id")
  @Roles(RolesType.ADMIN)
  update(@Param("id") id: number, @Body() updateProjectManagerDto: UpdateProjectManagerDto) : Promise<UpdateResult> {
    return this.pmService.update(id, updateProjectManagerDto);
  }

  @Patch("disable/:id")
  @Roles(RolesType.ADMIN)
  disable(@Param("id") id: number) : Promise<UpdateResult> {
    return this.pmService.disable(id);
  }

  @Patch("enable/:id")
  @Roles(RolesType.ADMIN)
  enable(@Param("id") id : number) : Promise<UpdateResult> {
    return this.pmService.enable(id);
  }
}
