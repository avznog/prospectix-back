import { PartialType } from '@nestjs/swagger';
import { CreateGoalTemplateDto } from './create-goal-template.dto';

export class UpdateGoalTemplateDto extends PartialType(CreateGoalTemplateDto) {}
