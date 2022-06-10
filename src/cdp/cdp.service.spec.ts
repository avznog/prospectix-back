import { Test, TestingModule } from '@nestjs/testing';
import { CdpService } from './cdp.service';

describe('CdpService', () => {
  let service: CdpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CdpService],
    }).compile();

    service = module.get<CdpService>(CdpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
