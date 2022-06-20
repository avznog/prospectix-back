import { Controller } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('emails')
@ApiTags("emails")
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}
}
