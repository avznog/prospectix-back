import { Body, Controller, Get, Param, Patch, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SentryService } from '../../apis/sentry/sentry.service';
import { Roles } from '../../auth/annotations/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.model';
import JwtAuthGuard from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { RolesType } from '../../auth/role.type';
import { SentryInterceptor } from '../../sentry.interceptor';
import { ProjectManager } from '../../users/project-managers/entities/project-manager.entity';
import { UpdateSearchParamsDto } from './dto/update-search-params.dto';
import { SearchParamsService } from './search-params.service';


@Controller('search-params')
@ApiTags("search-params")
@UseInterceptors(SentryInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
export class SearchParamsController {
  constructor(
    private readonly searchParamsService: SearchParamsService,
    private readonly sentryService: SentryService
  ) {}

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get()
  findAll(@CurrentUser() user: ProjectManager) {
    this.sentryService.setSentryUser(user);
    return this.searchParamsService.findAll();
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Patch(":id")
  update(@Param("id") id: number, @Body() updateSearchParamsDto: UpdateSearchParamsDto, @CurrentUser() user: ProjectManager) {
    this.sentryService.setSentryUser(user);
    return this.searchParamsService.update(id, updateSearchParamsDto);
  }

}
