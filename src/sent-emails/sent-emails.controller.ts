import { Controller } from '@nestjs/common';
import { SentEmailsService } from './sent-emails.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('sent-emails')
@ApiTags("sent-emails")
export class SentEmailsController {
  constructor(private readonly sentEmailsService: SentEmailsService) {}
}
