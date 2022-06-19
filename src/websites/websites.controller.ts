import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WebsitesService } from './websites.service';
import { CreateWebsiteDto } from './dto/create-website.dto';
import { UpdateWebsiteDto } from './dto/update-website.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('websites')
@ApiTags("websites")
export class WebsitesController {
  constructor(private readonly websitesService: WebsitesService) {}
}
