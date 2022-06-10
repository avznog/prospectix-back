import { Test, TestingModule } from '@nestjs/testing';
import { CdpController } from './cdp.controller';
import { CdpService } from './cdp.service';

describe('CdpController', () => {
  let controller: CdpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CdpController],
      providers: [CdpService],
    }).compile();

    controller = module.get<CdpController>(CdpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
