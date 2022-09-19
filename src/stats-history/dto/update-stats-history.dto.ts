import { PartialType } from '@nestjs/swagger';
import { CreateStatsHistoryDto } from './create-stats-history.dto';

export class UpdateStatsHistoryDto extends PartialType(CreateStatsHistoryDto) {}
