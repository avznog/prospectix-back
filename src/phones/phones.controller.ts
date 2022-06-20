import { Controller } from '@nestjs/common';
import { PhonesService } from './phones.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('phones')
@ApiTags("phones")
export class PhonesController {
  constructor(private readonly phonesService: PhonesService) {}
}
