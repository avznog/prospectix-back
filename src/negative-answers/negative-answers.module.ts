import { Module } from '@nestjs/common';
import { NegativeAnswersService } from './negative-answers.service';
import { NegativeAnswersController } from './negative-answers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NegativeAnswer } from './entities/negative-answer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NegativeAnswer])],
  controllers: [NegativeAnswersController],
  providers: [NegativeAnswersService]
})
export class NegativeAnswersModule {}
