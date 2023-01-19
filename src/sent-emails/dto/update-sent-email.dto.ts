import { PartialType } from '@nestjs/swagger';
import { CreateSentEmailDto } from './create-sent-email.dto';

export class UpdateSentEmailDto extends PartialType(CreateSentEmailDto) {}
