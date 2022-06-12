import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProjectManagersService } from './project-managers.service';
import { CreateProjectManagerDto } from './dto/create-project-manager.dto';
import { UpdateProjectManagerDto } from './dto/update-project-manager.dto';

@Controller('project-managers')
export class ProjectManagersController {
  constructor(private readonly projectManagerService: ProjectManagersService) {}

  @Post()
  create(@Body() createProjectManagerDto: CreateProjectManagerDto) {
    return this.projectManagerService.create(createProjectManagerDto);
  }

  @Get()
  findAll() {
    return this.projectManagerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectManagerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectManagerDto: UpdateProjectManagerDto) {
    return this.projectManagerService.update(+id, updateProjectManagerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectManagerService.remove(+id);
  }
}
