import { Body, Controller, Get, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/annotations/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.model';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesType } from 'src/auth/role.type';
import { CreateCityDto } from 'src/dto/cities/create-city.dto';
import { City } from 'src/entities/cities/city.entity';
import { ProjectManager } from 'src/entities/project-managers/project-manager.entity';
import { SentryInterceptor } from 'src/sentry.interceptor';
import { CitiesService } from 'src/services/cities/cities.service';
import { SentryService } from 'src/services/sentry/sentry/sentry.service';

@UseInterceptors(SentryInterceptor)
@Controller('cities')
@ApiTags("cities")
@UseGuards(JwtAuthGuard, RolesGuard)
export class CitiesController {
  constructor(
    private readonly citiesService: CitiesService,
    private readonly sentryService: SentryService
    ) {}

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("find-all")
  findAll(@CurrentUser() user: ProjectManager) {
    this.sentryService.setSentryUser(user);
    return this.citiesService.findAll()
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("find-all-by-zipcode")
  findAllByZipcode(@CurrentUser() user: ProjectManager) {
    this.sentryService.setSentryUser(user);
    return this.citiesService.findAllByZipcode()
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Post("add")
  create(@Body() createCityDto: CreateCityDto, @CurrentUser() user: ProjectManager) : Promise<City> {
    this.sentryService.setSentryUser(user);
    return this.citiesService.create(createCityDto);
  }
}
