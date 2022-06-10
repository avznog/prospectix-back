import { Module } from '@nestjs/common';
import { CdpService } from './cdp.service';
import { CdpController } from './cdp.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [],
  controllers: [CdpController],
  providers: [CdpService],
  exports: [CdpService]
})
export class CdpModule {}
