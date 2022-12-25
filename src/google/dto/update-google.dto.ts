import { PartialType } from '@nestjs/swagger';
import { CreateGoogleDto } from './create-google.dto';

export class UpdateGoogleDto extends PartialType(CreateGoogleDto) {}
