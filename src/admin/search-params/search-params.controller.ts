import { Body, Controller, Get, Param, Patch, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/annotations/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.model';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesType } from 'src/auth/role.type';
import { UpdateSearchParamsDto } from 'src/dto/search-params/update-search-params.dto';
import { ProjectManager } from 'src/users/project-managers/entities/project-manager.entity';
import { SentryInterceptor } from 'src/sentry.interceptor';
import { SearchParamsService } from 'src/services/search-params/search-params.service';
import { SentryService } from 'src/services/sentry/sentry.service';


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
