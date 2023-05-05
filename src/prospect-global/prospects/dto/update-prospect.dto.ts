import { PartialType } from '@nestjs/swagger';
import { CreateProspectDto } from './create-prospect.dto';

export class UpdateProspectDto extends PartialType(CreateProspectDto) {}
