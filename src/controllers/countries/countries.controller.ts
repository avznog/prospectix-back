import { Body, Controller, Get, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/annotations/roles.decorator';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesType } from 'src/auth/role.type';
import { CreateCountryDto } from 'src/dto/countries/create-country.dto';
import { Country } from 'src/entities/countries/country.entity';
import { SentryInterceptor } from 'src/sentry.interceptor';
import { CountriesService } from 'src/services/countries/countries.service';

@UseInterceptors(SentryInterceptor)
@Controller('countries')
@ApiTags("countries")
@UseGuards(JwtAuthGuard, RolesGuard)
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get()
  findAll() : Promise<Country[]> {
    return this.countriesService.findAll();
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Post("add")
  create(@Body() createCountryDto: CreateCountryDto) : Promise<Country> {
    return this.countriesService.create(createCountryDto);
  }
}
