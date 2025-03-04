
import { UseInterceptors, Controller, UseGuards, Get, Post, Body, Query, Patch, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateResult } from 'typeorm';
import { SentryService } from '../../apis/sentry/sentry.service';
import { Roles } from '../../auth/annotations/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.model';
import JwtAuthGuard from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { RolesType } from '../../auth/role.type';
import { ReasonDisabledType } from '../../constants/reasonDisabled.type';
import { SentryInterceptor } from '../../sentry.interceptor';
import { ProjectManager } from '../../users/project-managers/entities/project-manager.entity';
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
  constructor(
    private readonly prospectsService: ProspectsService,
    private readonly sentryService: SentryService
    ) {
  }

  @Roles(RolesType.ADMIN)
  @Get("create-from-scrapper")
  createFromScrapper() {
    // console.log("started")
    // this.prospectsService.createFromScrapper();
    console.log("endpoint disabled")
  }

  @Roles(RolesType.ADMIN)
  @Get("add-prospects-part1")
  addProspectsv2part1() {
    // return this.prospectsService.addProspectsv2part1();
  }
  @Roles(RolesType.ADMIN)
  @Get("add-prospects-part2")
  addProspectsv2part2() {
    // return this.prospectsService.addProspectsv2part2();
  }


  @Roles(RolesType.ADMIN)
  @Get("add-events")
  addEvents() {
    // console.log("started adding events")
    // this.prospectsService.addEvents();
    console.log("endpoint disabled")
  }
  
  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Post("create")
  create(@Body() createProspectDto: CreateProspectDto, @CurrentUser() user: ProjectManager) : Promise<Prospect> {
    this.sentryService.setSentryUser(user);
    return this.prospectsService.create(createProspectDto, user);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("find-all-paginated")
    findAllPaginated(@Query() researchParamsProspectDto: ResearchParamsProspectDto, @CurrentUser() user: ProjectManager) : Promise<{prospects: Prospect[], count: number}> {
      this.sentryService.setSentryUser(user);
    return this.prospectsService.findAllPaginated(researchParamsProspectDto);
  }

  @Patch(':id')
  @Roles(RolesType.CDP, RolesType.ADMIN)
  update(@Param('id') id: string, @Body() updateProspectDto: UpdateProspectDto, @CurrentUser() user: ProjectManager) : Promise<UpdateResult>{
    this.sentryService.setSentryUser(user);
    return this.prospectsService.update(+id, updateProspectDto);
  }

  @Patch("all-prospect/:id")
  @Roles(RolesType.CDP, RolesType.ADMIN)
  updateAllProspect(@Param("id") id: number, @Body() updateProspectDto: UpdateProspectDto, @CurrentUser() user: ProjectManager) : Promise<UpdateResult> {
    this.sentryService.setSentryUser(user);
    return this.prospectsService.updateAllProspect(id, updateProspectDto);
  }

  @Get('by-city/:id/:cityName')
  @Roles(RolesType.CDP, RolesType.ADMIN)
  updateByCity(@Param('id') id: string, @Param("cityName") cityName: string, @CurrentUser() user: ProjectManager) : Promise<UpdateResult>{
    this.sentryService.setSentryUser(user);
    return this.prospectsService.updateByCity(+id, cityName);
  }

  @Get('by-secondary-activity/:id/:activityName')
  @Roles(RolesType.CDP, RolesType.ADMIN)
  updateBySecondaryActivity(@Param('id') id: string, @Param("activityName") activityName: string, @CurrentUser() user: ProjectManager) : Promise<UpdateResult>{
    this.sentryService.setSentryUser(user);
    return this.prospectsService.updateBySecondaryActivity(+id, activityName);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get('disable/:id/:reason')
  remove(@Param('id') id: number, @Param("reason") reason: ReasonDisabledType, @CurrentUser() user: ProjectManager) : Promise<UpdateResult>{
    this.sentryService.setSentryUser(user);
    return this.prospectsService.disable(id, reason);
  }

  @Roles(RolesType.ADMIN)
  @Get("enable/:id")
  enable(@Param("id") id: number, @CurrentUser() user: ProjectManager) : Promise<UpdateResult> {
    this.sentryService.setSentryUser(user);
    return this.prospectsService.enable(id);
  }
}
