import { PartialType } from '@nestjs/swagger';
import { CreateNegativeAnswerDto } from './create-negative-answer.dto';

export class UpdateNegativeAnswerDto extends PartialType(CreateNegativeAnswerDto) {}
