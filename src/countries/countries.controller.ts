import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/annotations/roles.decorator';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CountriesService } from './countries.service';
import { Country } from './entities/country.entity';

@Controller('countries')
@ApiTags("countries")
@UseGuards(JwtAuthGuard, RolesGuard)
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Roles("Cdp","Admin")
  @Get()
  findAll() : Promise<Country[]> {
    return this.countriesService.findAll();
  }
}
