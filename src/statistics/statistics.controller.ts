import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/annotations/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.model';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesType } from 'src/auth/role.type';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { UpdateResult } from 'typeorm';
import { UpdateStatisticDto } from './dto/update-statistic.dto';
import { Statistic } from './entities/statistic.entity';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Patch(':id')
  @Roles(RolesType.CDP, RolesType.ADMIN)
  update(@Param('id') id: string, @Body() updateStatisticDto: UpdateStatisticDto) : Promise<UpdateResult> {
    return this.statisticsService.update(+id, updateStatisticDto);
  }

  @Get("my-stats")
  @Roles(RolesType.CDP, RolesType.ADMIN)
  findMyStats(@CurrentUser() user: ProjectManager) : Promise<Statistic> {
    return this.statisticsService.findMyStats(user);
  }

}
