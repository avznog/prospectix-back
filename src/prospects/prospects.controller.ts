import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/annotations/roles.decorator';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesType } from 'src/auth/role.type';
import { ReasonDisabledType } from 'src/constants/reasonDisabled.type';
import { SentryInterceptor } from 'src/sentry.interceptor';
import { UpdateResult } from 'typeorm';
import { CreateProspectDto } from './dto/create-prospect.dto';
import { ResearchParamsProspectDto } from './dto/research-params-prospect.dto';
import { UpdateProspectDto } from './dto/update-prospect.dto';
import { Prospect } from './entities/prospect.entity';
import { ProspectsService } from './prospects.service';

@UseInterceptors(SentryInterceptor)
@Controller('prospects')
@ApiTags('prospects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProspectsController {
  constructor(private readonly prospectsService: ProspectsService) {
  }

  @Roles(RolesType.ADMIN)
  @Get("create-from-scrapper")
  createFromScrapper() {
    console.log("started")
    this.prospectsService.createFromScrapper();
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Post("create")
  create(@Body() createProspectDto: CreateProspectDto) : Promise<Prospect> {
    return this.prospectsService.create(createProspectDto);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("find-all-paginated")
    findAllPaginated(@Query() researchParamsProspectDto: ResearchParamsProspectDto) : Promise<Prospect[]> {
    return this.prospectsService.findAllPaginated(researchParamsProspectDto);
  }

  @Patch(':id')
  @Roles(RolesType.CDP, RolesType.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateProspectDto: UpdateProspectDto,
  ) : Promise<UpdateResult>{
    return this.prospectsService.update(+id, updateProspectDto);
  }

  @Patch("all-prospect/:id")
  @Roles(RolesType.CDP, RolesType.ADMIN)
  updateAllProspect(@Param("id") id: number, @Body() updateProspectDto: UpdateProspectDto) : Promise<UpdateResult> {
    return this.prospectsService.updateAllProspect(id, updateProspectDto);
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
  @Get('disable/:id/:reason')
  remove(@Param('id') id: number, @Param("reason") reason: ReasonDisabledType) : Promise<UpdateResult>{
    return this.prospectsService.disable(id, reason);
  }

  @Roles(RolesType.ADMIN)
  @Get("enable/:id")
  enable(@Param("id") id: number) : Promise<UpdateResult> {
    return this.prospectsService.enable(id);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("count-for-domains")
  countForDomains() {
    return this.prospectsService.countForDomains();
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("count-for-cities")
  countForCities() {
    return this.prospectsService.countForCities();
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("count-prospects")
  countProspects(@Query() researchParamsProspectDto: ResearchParamsProspectDto) : Promise<number> {
    return this.prospectsService.countProspects(researchParamsProspectDto);
  }
}
