import { PartialType } from '@nestjs/swagger';
import { CreateMailTemplateDto } from './create-mail-template.dto';

export class UpdateMailTemplateDto extends PartialType(CreateMailTemplateDto) {}
