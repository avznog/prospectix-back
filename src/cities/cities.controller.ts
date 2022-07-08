import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { get } from 'http';
import { Roles } from 'src/auth/annotations/roles.decorator';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CitiesService } from './cities.service';
import { City } from './entities/city.entity';

@Controller('cities')
@ApiTags("cities")
@UseGuards(JwtAuthGuard, RolesGuard)
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Roles("Cdp","Admin")
  @Get()
  findAll() : Promise<City[]> {
    return this.citiesService.findAll();
  } 
}
