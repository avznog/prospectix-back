import { Controller } from '@nestjs/common';
import { WebsitesService } from './websites.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('websites')
@ApiTags("websites")
export class WebsitesController {
  constructor(private readonly websitesService: WebsitesService) {}
}
