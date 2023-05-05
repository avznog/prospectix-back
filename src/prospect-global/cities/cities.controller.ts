import { Body, Controller, Get, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/annotations/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.model';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesType } from 'src/auth/role.type';
import { CreateCityDto } from 'src/prospect-global/cities/dto/create-city.dto';
import { City } from 'src/prospect-global/cities/entities/city.entity';
import { ProjectManager } from 'src/users/project-managers/entities/project-manager.entity';
import { SentryInterceptor } from 'src/sentry.interceptor';
import { SentryService } from 'src/apis/sentry/sentry.service';
import { CitiesService } from './cities.service';


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
