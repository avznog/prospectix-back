import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CitiesService } from './cities.service';

@Controller('cities')
@ApiTags("cities")
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}
}
