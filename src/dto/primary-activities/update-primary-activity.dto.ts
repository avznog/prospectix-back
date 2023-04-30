import { PartialType } from '@nestjs/swagger';
import { CreatePrimaryActivityDto } from './create-primary-activity.dto';

export class UpdatePrimaryActivityDto extends PartialType(CreatePrimaryActivityDto) {}
