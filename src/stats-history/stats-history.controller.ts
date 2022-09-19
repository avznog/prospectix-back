import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { StatsHistoryService } from './stats-history.service';
import { CreateStatsHistoryDto } from './dto/create-stats-history.dto';
import { UpdateStatsHistoryDto } from './dto/update-stats-history.dto';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/annotations/roles.decorator';
import { RolesType } from 'src/auth/role.type';
import { CurrentUser } from 'src/auth/decorators/current-user.model';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { StatsHistory } from './entities/stats-history.entity';

@Controller('stats-history')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StatsHistoryController {
  constructor(private readonly statsHistoryService: StatsHistoryService) {}

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Post()
  create(@Body() createStatsHistoryDto: CreateStatsHistoryDto, @CurrentUser() user: ProjectManager) : Promise<StatsHistory> {
    return this.statsHistoryService.create(createStatsHistoryDto, user);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("for-me")
  findAllForMe(@CurrentUser() user: ProjectManager) : Promise<StatsHistory[]> {
    return this.statsHistoryService.findAllForMe(user);
  }
}
