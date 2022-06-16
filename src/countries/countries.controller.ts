import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CountriesService } from './countries.service';

@Controller('countries')
@ApiTags("countries")
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}
}
