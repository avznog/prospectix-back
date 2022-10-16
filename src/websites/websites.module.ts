import { Module } from '@nestjs/common';
import { WebsitesService } from './websites.service';
import { WebsitesController } from './websites.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Website } from './entities/website.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Website])],
  controllers: [WebsitesController],
  providers: [WebsitesService]
})
export class WebsitesModule {}
