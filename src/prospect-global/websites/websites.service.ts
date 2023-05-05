import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateWebsiteDto } from 'src/dto/websites/update-website.dto';
import { Website } from 'src/prospect-global/websites/entities/website.entity';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class WebsitesService {
  constructor(
    @InjectRepository(Website)
    private readonly websiteRepository: Repository<Website>
  ) {}

  async update(idWebsite: number, updateWebsiteDto: UpdateWebsiteDto) : Promise<UpdateResult> {
    try {
      return await this.websiteRepository.update(idWebsite, updateWebsiteDto);
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de modifier le site internet", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
