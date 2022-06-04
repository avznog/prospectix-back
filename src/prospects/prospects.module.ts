import { Module } from '@nestjs/common';
import { ProspectsService } from './prospects.service';
import { ProspectsController } from './prospects.controller';

@Module({
  controllers: [ProspectsController],
  providers: [ProspectsService]
})
export class ProspectsModule {}
