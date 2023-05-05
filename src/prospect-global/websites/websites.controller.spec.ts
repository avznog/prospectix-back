import { Test, TestingModule } from '@nestjs/testing';
import { WebsitesService } from 'src/services/websites/websites.service';
import { WebsitesController } from './websites.controller';

describe('WebsitesController', () => {
  let controller: WebsitesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebsitesController],
      providers: [WebsitesService],
    }).compile();

    controller = module.get<WebsitesController>(WebsitesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
