import { PartialType } from '@nestjs/swagger';
import { CreateCdpDto } from './create-cdp.dto';

export class UpdateCdpDto extends PartialType(CreateCdpDto) {}
