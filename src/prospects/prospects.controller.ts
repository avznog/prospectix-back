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
import { RolesType } from 'src/auth/role.type';

@Controller('prospects')
@ApiTags('prospects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProspectsController {
  constructor(private readonly prospectsService: ProspectsService) {}

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Post("create")
  create(@Body() createProspectDto: CreateProspectDto) : Promise<Prospect> {
    return this.prospectsService.create(createProspectDto);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("find-all-paginated")
  findAllPaginated(@Query("take") take: number, @Query("skip") skip: number, @Query("keyword") keyword: string, @Query("city") city: string, @Query("activity") activity: string) : Promise<Prospect[]> {
    return this.prospectsService.findAllPaginated(keyword, city, activity, take, skip);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get('findOne/:id')
  findOne(@Param('id') id: string) : Promise<Prospect> {
    return this.prospectsService.findOne(+id);
  }

  @Patch(':id')
  @Roles(RolesType.CDP, RolesType.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateProspectDto: UpdateProspectDto,
  ) : Promise<UpdateResult>{
    return this.prospectsService.update(+id, updateProspectDto);
  }

  @Get('by-city/:id/:cityName')
  @Roles(RolesType.CDP, RolesType.ADMIN)
  updateByCity(@Param('id') id: string, @Param("cityName") cityName: string) : Promise<UpdateResult>{
    return this.prospectsService.updateByCity(+id, cityName);
  }

  @Get('by-activity/:id/:activityName')
  @Roles(RolesType.CDP, RolesType.ADMIN)
  updateByActivity(@Param('id') id: string, @Param("activityName") activityName: string) : Promise<UpdateResult>{
    return this.prospectsService.updateByActivity(+id, activityName);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get('disable/:id')
  remove(@Param('id') id: number) : Promise<UpdateResult>{
    return this.prospectsService.disable(id);
  }

  @Roles(RolesType.ADMIN)
  @Get("enable/:id")
  enable(@Param("id") id: number) : Promise<UpdateResult> {
    return this.prospectsService.enable(id);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("by-bookmarks/:pmPseudo")
  findAllByBookmark(@Param("pmPseudo") pmPseudo: string) : Promise<Prospect[]> {
    return this.prospectsService.findAllByBookmark(pmPseudo);
  }
}
