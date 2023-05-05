import { Body, Controller, Get, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SentryService } from 'src/apis/sentry/sentry.service';
import { Roles } from 'src/auth/annotations/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.model';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesType } from 'src/auth/role.type';
import { CreateCountryDto } from 'src/prospect-global/countries/dto/create-country.dto';
import { Country } from 'src/prospect-global/countries/entities/country.entity';
import { SentryInterceptor } from 'src/sentry.interceptor';
import { ProjectManager } from 'src/users/project-managers/entities/project-manager.entity';
import { CountriesService } from './countries.service';


@UseInterceptors(SentryInterceptor)
@Controller('countries')
@ApiTags("countries")
@UseGuards(JwtAuthGuard, RolesGuard)
export class CountriesController {
  constructor(
    private readonly countriesService: CountriesService,
    private readonly sentryService: SentryService
    ) {}

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get()
  findAll(@CurrentUser() user: ProjectManager) : Promise<Country[]> {
    this.sentryService.setSentryUser(user);
    return this.countriesService.findAll();
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Post("add")
  create(@Body() createCountryDto: CreateCountryDto, @CurrentUser() user: ProjectManager) : Promise<Country> {
    this.sentryService.setSentryUser(user);
    return this.countriesService.create(createCountryDto);
  }
}
