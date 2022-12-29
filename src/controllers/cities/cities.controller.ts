import { Body, Controller, Get, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/annotations/roles.decorator';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesType } from 'src/auth/role.type';
import { CreateCityDto } from 'src/dto/cities/create-city.dto';
import { City } from 'src/entities/cities/city.entity';
import { SentryInterceptor } from 'src/sentry.interceptor';
import { CitiesService } from 'src/services/cities/cities.service';

@UseInterceptors(SentryInterceptor)
@Controller('cities')
@ApiTags("cities")
@UseGuards(JwtAuthGuard, RolesGuard)
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get()
  findAll() : Promise<City[]> {
    return this.citiesService.findAll();
  } 

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Post("add")
  create(@Body() createCityDto: CreateCityDto) : Promise<City> {
    return this.citiesService.create(createCityDto);
  }
}
