import { Controller, Get, Post, Body, Patch, Param, UseGuards, Query } from '@nestjs/common';
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
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProspectsController {
  constructor(private readonly prospectsService: ProspectsService) {}

  @Roles("Cdp","Admin")
  @Post("create")
  create(@Body() createProspectDto: CreateProspectDto) : Promise<Prospect> {
    return this.prospectsService.create(createProspectDto);
  }

  @Roles("Cdp","Admin")
  @Get("find-all-paginated")
  findAllPaginated(@Query("take") take: number, @Query("skip") skip: number, @Query("keyword") keyword: string, @Query("city") city: string, @Query("activity") activity: string) : Promise<Prospect[]> {
    return this.prospectsService.findAllPaginated(keyword, city, activity, take, skip);
  }

  @Roles("Cdp","Admin")
  @Get("find-all-bookmarks-paginated")
  findAllBookmarksPaginated(@Query("take") take: number, @Query("skip") skip: number, @Query("pseudo") pseudo: string, @Query("activity") activity: string, @Query("city") city: string, @Query("keyword") keyword: string) : Promise<Prospect[]> {
    return this.prospectsService.findAllBookmarksPaginated(take, skip, pseudo, activity, city, keyword);
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

  @Get('by-city/:id/:cityName')
  @Roles("Cdp","Admin")
  updateByCity(@Param('id') id: string, @Param("cityName") cityName: string) : Promise<UpdateResult>{
    return this.prospectsService.updateByCity(+id, cityName);
  }

  @Get('by-activity/:id/:activityName')
  @Roles("Cdp","Admin")
  updateByActivity(@Param('id') id: string, @Param("activityName") activityName: string) : Promise<UpdateResult>{
    return this.prospectsService.updateByActivity(+id, activityName);
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
  @Get("by-bookmarks/:pmPseudo")
  findAllByBookmark(@Param("pmPseudo") pmPseudo: string) : Promise<Prospect[]> {
    return this.prospectsService.findAllByBookmark(pmPseudo);
  }
}
