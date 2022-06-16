import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
} from '@nestjs/common';
import { ProspectsService } from './prospects.service';
import { CreateProspectDto } from './dto/create-prospect.dto';
import { UpdateProspectDto } from './dto/update-prospect.dto';
import { ApiTags } from '@nestjs/swagger';
import { Prospect } from './entities/prospect.entity';

@Controller('prospects')
@ApiTags('prospects')
export class ProspectsController {
  constructor(private readonly prospectsService: ProspectsService) {}

  // @UseGuards(JwtAuthenticationGuard)
  @Post()
  create(@Body() createProspectDto: CreateProspectDto) {
    return this.prospectsService.create(createProspectDto);
  }

  // @UseGuards(JwtAuthenticationGuard)
  @Get()
  findAll() {
    return this.prospectsService.findAll();
  }

  // @UseGuards(JwtAuthenticationGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.prospectsService.findOne(+id);
  }

  // @UseGuards(JwtAuthenticationGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProspectDto: UpdateProspectDto,
  ) {
    return this.prospectsService.update(+id, updateProspectDto);
  }

  // @UseGuards(JwtAuthenticationGuard)
  @Patch(':id')
  remove(@Param('id') id: string, @Body() createProspectDto: CreateProspectDto) {
    return this.prospectsService.disable(+id, createProspectDto);
  }

  @Get("by-activity:activityName")
  findAllByActivity(@Param() activityName: string) : Promise<Prospect[]> {
    return this.prospectsService.findAllByActivity(activityName);
  }

  @Get("by-city:cityName")
  findAllByCity(@Param() cityName: string) : Promise<Prospect[]> {
    return this.prospectsService.findAllByCity(cityName);
  }

  @Get("by-bookmarks:pmName")
  findAllByBookmark(@Param() pmName: string) : Promise<Prospect[]> {
    return this.prospectsService.findAllByBookmark(pmName);
  }

  @Get("by-phone:phoneProspect")
  findAllByPhone(@Param("phoneProspect") phoneProspect: string) : Promise<Prospect[]> {
    return this.prospectsService.findAllByPhone(phoneProspect);
  }

  @Get("by-website:websiteProspect")
  findAllByWebsite(@Param("websiteProspect") websiteProspect: string) : Promise<Prospect[]> {
    return this.prospectsService.findAllByWebsite(websiteProspect);
  }
  
  @Get("by-address:addressProspect")
  findAllByAddress(@Param("addressProspect") addressProspect: string) : Promise<Prospect[]> {
    return this.prospectsService.findAllByAddress(addressProspect);
  }

  @Get("by-mail/:emailProspect")
  findAllByMail(@Param("emailProspect") emailProspect: string) : Promise<Prospect[]> {
   return this.prospectsService.findAllByMail(emailProspect); 
  }
}
