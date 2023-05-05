import { Test, TestingModule } from '@nestjs/testing';
import { GoogleService } from 'src/services/google/google.service';
import { GoogleController } from './google.controller';

describe('GoogleController', () => {
  let controller: GoogleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoogleController],
      providers: [GoogleService],
    }).compile();

    controller = module.get<GoogleController>(GoogleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
