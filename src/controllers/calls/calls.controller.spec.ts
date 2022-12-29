import { Test, TestingModule } from '@nestjs/testing';
import { CallsService } from 'src/services/calls/calls.service';
import { CallsController } from './calls.controller';

describe('CallsController', () => {
  let controller: CallsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CallsController],
      providers: [CallsService],
    }).compile();

    controller = module.get<CallsController>(CallsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
