import { Body, Controller, Get, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/annotations/roles.decorator';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesType } from 'src/auth/role.type';
import { SentryInterceptor } from 'src/sentry.interceptor';
import { CountriesService } from './countries.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { Country } from './entities/country.entity';

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
