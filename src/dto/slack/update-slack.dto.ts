import { PartialType } from '@nestjs/swagger';
import { CreateSlackDto } from './create-slack.dto';

export class UpdateSlackDto extends PartialType(CreateSlackDto) {}
