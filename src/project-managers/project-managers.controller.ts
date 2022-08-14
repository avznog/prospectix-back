import { Controller, Post, Body, UseGuards, Get, Delete, Param, Patch, Query } from '@nestjs/common';
import { ProjectManagersService } from './project-managers.service';
import { CreateProjectManagerDto } from './dto/create-project-manager.dto';
import { ApiTags } from '@nestjs/swagger';
import { ProjectManager } from './entities/project-manager.entity';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/annotations/roles.decorator';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UpdateProjectManagerDto } from './dto/update-project-manager.dto';

@Controller('project-managers')
@ApiTags('project-managers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectManagersController {
  constructor(private readonly pmService: ProjectManagersService) {}

  @Post()
  @Roles("Admin")
  create(@Body() createProjectManagerDto: CreateProjectManagerDto) : Promise<ProjectManager> {
    return this.pmService.create(createProjectManagerDto);
  }

  @Get("findAll")
  @Roles("Admin","Cdp")
  findAll() : Promise<ProjectManager[]> {
    return this.pmService.findAll();
  }

  @Get("find-all-paginated")
  @Roles("Cdp","Admin")
  findAllPaginated(@Query("take") take: number, @Query("skip") skip: number) : Promise<ProjectManager[]> {
    return this.pmService.findAllPaginated(take, skip);
  }

  @Patch(":id")
  @Roles("Admin")
  update(@Param("id") id: number, @Body() updateProjectManagerDto: UpdateProjectManagerDto) : Promise<UpdateResult> {
    return this.pmService.update(id, updateProjectManagerDto);
  }

  @Patch("disable/:id")
  @Roles("Admin")
  disable(@Param("id") id: number) : Promise<UpdateResult> {
    return this.pmService.disable(id);
  }

  @Patch("enable/:id")
  @Roles("Admin")
  enable(@Param("id") id : number) : Promise<UpdateResult> {
    return this.pmService.enable(id);
  }
}
