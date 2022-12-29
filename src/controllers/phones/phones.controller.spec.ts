import { Test, TestingModule } from '@nestjs/testing';
import { PhonesService } from 'src/services/phones/phones.service';
import { PhonesController } from './phones.controller';

describe('PhonesController', () => {
  let controller: PhonesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhonesController],
      providers: [PhonesService],
    }).compile();

    controller = module.get<PhonesController>(PhonesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
