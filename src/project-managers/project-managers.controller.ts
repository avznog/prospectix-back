import { Controller, Post, Body, UseGuards, Get, Delete, Param, Patch, Query } from '@nestjs/common';
import { ProjectManagersService } from './project-managers.service';
import { CreateProjectManagerDto } from './dto/create-project-manager.dto';
import { ApiTags } from '@nestjs/swagger';
import { ProjectManager } from './entities/project-manager.entity';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/annotations/roles.decorator';
import { UpdateResult } from 'typeorm';
import { UpdateProjectManagerDto } from './dto/update-project-manager.dto';
import { RolesType } from 'src/auth/role.type';
import { CurrentUser } from 'src/auth/decorators/current-user.model';
import { ResearchParamsProjectManagersDto } from './dto/research-params-project-managers.dto';

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
