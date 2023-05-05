import { PartialType } from '@nestjs/swagger';
import { CreateSecondaryActivityDto } from './create-secondary-activity.dto';

export class UpdateSecondaryActivityDto extends PartialType(CreateSecondaryActivityDto) {}
