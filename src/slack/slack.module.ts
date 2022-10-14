import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SlackController } from './slack.controller';
import { SlackService } from './slack.service';

@Module({
  imports: [HttpModule],
  controllers: [SlackController],
  providers: [SlackService]
})
export class SlackModule {}
