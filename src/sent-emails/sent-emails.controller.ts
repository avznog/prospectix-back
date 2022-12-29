import { Body, Controller, Get, Param, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/annotations/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.model';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesType } from 'src/auth/role.type';
import { GoogleService } from 'src/google/google.service';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { SentryInterceptor } from 'src/sentry.interceptor';
import { CreateSentEmailDto } from './dto/create-sent-email.dto';
import { ResearchParamsSentEmailsDto } from './dto/research-params-sent-emails.dto';
import { sendEmailDto } from './dto/send-email.dto';
import { SentEmail } from './entities/sent-email.entity';
import { SentEmailsService } from './sent-emails.service';

@UseInterceptors(SentryInterceptor)
@Controller('sent-emails')
@ApiTags("sent-emails")
@UseGuards(JwtAuthGuard, RolesGuard)
export class SentEmailsController {
  constructor(
    private readonly sentEmailsService: SentEmailsService,
    private readonly googleService: GoogleService
    ) {}

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("find-all-paginated")
  findAllPaginated(@Query() researchParamsSentEmailsDto: ResearchParamsSentEmailsDto, @CurrentUser() user: ProjectManager) {
    return this.sentEmailsService.findAllPaginated(researchParamsSentEmailsDto, user);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("find-all-paginated-sent")
  findAllPaginatedSent(@Query() researchParamsSentEmailsDto: ResearchParamsSentEmailsDto, @CurrentUser() user: ProjectManager) {
    return this.sentEmailsService.findAllPaginatedSent(researchParamsSentEmailsDto, user);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Post("send/:id")
  async send(@Body() sendEmailDto: sendEmailDto, @CurrentUser() pm: ProjectManager, @Param("id") idSentEmail: number){
    pm = await this.googleService.updateTokens(pm);
    return this.sentEmailsService.send(sendEmailDto, pm, idSentEmail);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Post()
  create(@Body() createSentEmailDto: CreateSentEmailDto, @CurrentUser() user) : Promise<SentEmail> {
    return this.sentEmailsService.create(createSentEmailDto, user);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("count-sent-emails")
  countSentEmails(@CurrentUser() user: ProjectManager, @Query() researchParamsSentEmails: ResearchParamsSentEmailsDto) : Promise<number> {
    return this.sentEmailsService.countSentEmails(user, researchParamsSentEmails);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("count-sent-emails-sent")
  countSentEmailsSent(@CurrentUser() user: ProjectManager, @Query() researchParamsSentEmails: ResearchParamsSentEmailsDto) : Promise<number> {
    return this.sentEmailsService.countSentEmailsSent(user, researchParamsSentEmails)
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("count-all-for-me")
  countAllForMe(@CurrentUser() user: ProjectManager) : Promise<number> {
    return this.sentEmailsService.countAllForMe(user);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("count-all")
  countAll(@Query() interval: { dateDown: Date, dateUp: Date }) {
    return this.sentEmailsService.countAll(interval);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("count-weekly-for-me")
  countWeeklyForMe(@CurrentUser() user: ProjectManager) : Promise<number> {
    return this.sentEmailsService.countWeeklyForMe(user);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("count-all-by-weeks-for-me")
  countAllByWeeksForMe(@CurrentUser() user: ProjectManager) {
    return this.sentEmailsService.countAllByWeeksForMe(user);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Post("send-separately/:idSentEmail")
  sendSeparately(@Param("idSentEmail") idSentEmail: number, @Body() object: { object: string }) {
    return this.sentEmailsService.sendSeparately(idSentEmail, object.object)
  }
}
