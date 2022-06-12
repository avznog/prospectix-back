import { Module } from '@nestjs/common';
import { ProspectsService } from './prospects.service';
import { ProspectsController } from './prospects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prospect } from './entities/prospect.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Prospect])],
  controllers: [ProspectsController],
  providers: [ProspectsService]
})
export class ProspectsModule {}
