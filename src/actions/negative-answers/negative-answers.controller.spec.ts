import { Test, TestingModule } from '@nestjs/testing';
import { NegativeAnswersService } from 'src/services/negative-answers/negative-answers.service';
import { NegativeAnswersController } from './negative-answers.controller';

describe('NegativeAnswersController', () => {
  let controller: NegativeAnswersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NegativeAnswersController],
      providers: [NegativeAnswersService],
    }).compile();

    controller = module.get<NegativeAnswersController>(NegativeAnswersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
