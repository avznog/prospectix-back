import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ProjectManagersService } from './project-managers.service';
import { CreateProjectManagerDto } from './dto/create-project-manager.dto';
import { ApiTags } from '@nestjs/swagger';
import { ProjectManager } from './entities/project-manager.entity';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/annotations/roles.decorator';

@Controller('project-managers')
@ApiTags('project-managers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectManagersController {
  constructor(private readonly projectManagerService: ProjectManagersService) {}

  @Post()
  @Roles("Admin")
  create(@Body() createProjectManagerDto: CreateProjectManagerDto) : Promise<ProjectManager> {
    return this.projectManagerService.create(createProjectManagerDto);
  }
}
