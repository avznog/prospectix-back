import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProjectManagersService } from './project-managers.service';
import { CreateProjectManagerDto } from './dto/create-project-manager.dto';
import { UpdateProjectManagerDto } from './dto/update-project-manager.dto';

@Controller('project-managers')
export class ProjectManagersController {
  constructor(private readonly projectManagersService: ProjectManagersService) {}

  @Post()
  create(@Body() createProjectManagerDto: CreateProjectManagerDto) {
    return this.projectManagersService.create(createProjectManagerDto);
  }

  @Get()
  findAll() {
    return this.projectManagersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectManagersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectManagerDto: UpdateProjectManagerDto) {
    return this.projectManagersService.update(+id, updateProjectManagerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectManagersService.remove(+id);
  }
}
