import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { ProspectsService } from './prospects.service';
import { CreateProspectDto } from './dto/create-prospect.dto';
import { UpdateProspectDto } from './dto/update-prospect.dto';
import { ApiTags } from '@nestjs/swagger';
import { Prospect } from './entities/prospect.entity';
import { UpdateResult } from 'typeorm';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/annotations/roles.decorator';

@Controller('prospects')
@ApiTags('prospects')
// @UseGuards(JwtAuthGuard, RolesGuard)
export class ProspectsController {
  constructor(private readonly prospectsService: ProspectsService) {}

  @Roles("Cdp","Admin")
  @Post()
  create(@Body() createProspectDto: CreateProspectDto) : Promise<Prospect> {
    return this.prospectsService.create(createProspectDto);
  }

  @Roles("Cdp","Admin")
  @Get()
  findAll() : Promise<Prospect[]> {
    return this.prospectsService.findAll();
  }

  @Roles("Cdp","Admin")
  @Get('findOne/:id')
  findOne(@Param('id') id: string) : Promise<Prospect> {
    return this.prospectsService.findOne(+id);
  }

  @Patch(':id')
  @Roles("Cdp","Admin")
  update(
    @Param('id') id: string,
    @Body() updateProspectDto: UpdateProspectDto,
  ) : Promise<UpdateResult>{
    return this.prospectsService.update(+id, updateProspectDto);
  }

  @Roles("Cdp","Admin")
  @Get('disable/:id')
  remove(@Param('id') id: number) : Promise<UpdateResult>{
    return this.prospectsService.disable(id);
  }

  @Roles("Admin")
  @Get("enable/:id")
  enable(@Param("id") id: number) : Promise<UpdateResult> {
    return this.prospectsService.enable(id);
  }

  @Roles("Cdp","Admin")
  @Get("by-activity/:activityName")
  findAllByActivity(@Param("activityName") activityName: string) : Promise<Prospect[]> {
    return this.prospectsService.findAllByActivity(activityName);
  }

  @Roles("Cdp","Admin")
  @Get("by-city/:cityName")
  findAllByCity(@Param("cityName") cityName: string) : Promise<Prospect[]> {
    return this.prospectsService.findAllByCity(cityName);
  }

  @Roles("Cdp","Admin")
  @Get("by-bookmarks/:pmPseudo")
  findAllByBookmark(@Param("pmPseudo") pmPseudo: string) : Promise<Prospect[]> {
    return this.prospectsService.findAllByBookmark(pmPseudo);
  }

  @Roles("Cdp","Admin")
  @Get("by-phone/:phoneProspect")
  findAllByPhone(@Param("phoneProspect") phoneProspect: string) : Promise<Prospect[]> {
    return this.prospectsService.findAllByPhone(phoneProspect);
  }

  @Roles("Cdp","Admin")
  @Get("by-website/:websiteProspect")
  findAllByWebsite(@Param("websiteProspect") websiteProspect: string) : Promise<Prospect[]> {
    return this.prospectsService.findAllByWebsite(websiteProspect);
  }
  
  @Roles("Cdp","Admin")
  @Get("by-address/:addressProspect")
  findAllByAddress(@Param("addressProspect") addressProspect: string) : Promise<Prospect[]> {
    return this.prospectsService.findAllByAddress(addressProspect);
  }

  @Roles("Cdp","Admin")
  @Get("by-email/:emailProspect")
  findAllByMail(@Param("emailProspect") emailProspect: string) : Promise<Prospect> {
   return this.prospectsService.findAllByEmail(emailProspect); 
  }

  @Roles("Cdp","Admin")
  @Get("by-keywords/:keyword")
  findAllByKeywords(@Param("keyword") keyword: string) : Promise<Prospect[]> {
    return this.prospectsService.findAllByKeywords(keyword);
  }
}
