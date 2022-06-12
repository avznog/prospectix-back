import { PartialType } from '@nestjs/swagger';
import { CreateProjectManagerDto } from './create-project-manager.dto';

export class UpdateProjectManagerDto extends PartialType(CreateProjectManagerDto) {}
