import { Module } from '@nestjs/common';
import { NegativeAnswersService } from './negative-answers.service';
import { NegativeAnswersController } from './negative-answers.controller';

@Module({
  controllers: [NegativeAnswersController],
  providers: [NegativeAnswersService]
})
export class NegativeAnswersModule {}
