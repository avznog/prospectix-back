import { Body, Controller, Get, Param, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateSentEmailDto } from 'src/actions/sent-emails/dto/create-sent-email.dto';
import { SentEmail } from 'src/actions/sent-emails/entities/sent-email.entity';
import { GoogleService } from 'src/apis/google/google.service';
import { SentryService } from 'src/apis/sentry/sentry.service';
import { Roles } from 'src/auth/annotations/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.model';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesType } from 'src/auth/role.type';
import { SentryInterceptor } from 'src/sentry.interceptor';
import { ProjectManager } from 'src/users/project-managers/entities/project-manager.entity';
import { ResearchParamsSentEmailsDto } from './dto/research-params-sent-emails.dto';
import { SendEmailDto } from './dto/send-email.dto';
import { SentEmailsService } from './sent-emails.service';


@UseInterceptors(SentryInterceptor)
@Controller('sent-emails')
@ApiTags("sent-emails")
@UseGuards(JwtAuthGuard, RolesGuard)
export class SentEmailsController {
  constructor(
    private readonly sentEmailsService: SentEmailsService,
    private readonly googleService: GoogleService,
    private readonly sentryService: SentryService
    ) {}

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("find-all-paginated")
  findAllPaginated(@Query() researchParamsSentEmailsDto: ResearchParamsSentEmailsDto, @CurrentUser() user: ProjectManager) : Promise<{sentEmails: SentEmail[], count: number}> {
    this.sentryService.setSentryUser(user);
    return this.sentEmailsService.findAllPaginated(researchParamsSentEmailsDto, user);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Post("send/:id")
  async send(@Body() sendEmailDto: SendEmailDto, @CurrentUser() user: ProjectManager, @Param("id") idSentEmail: number){
    this.sentryService.setSentryUser(user);
    user = await this.googleService.updateTokens(user);
    return this.sentEmailsService.send(sendEmailDto, user, idSentEmail);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Post()
  create(@Body() createSentEmailDto: CreateSentEmailDto, @CurrentUser() user: ProjectManager) : Promise<SentEmail> {
    this.sentryService.setSentryUser(user);
    return this.sentEmailsService.create(createSentEmailDto, user);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("count-all-for-me")
  countAllForMe(@CurrentUser() user: ProjectManager) : Promise<number> {
    this.sentryService.setSentryUser(user);
    return this.sentEmailsService.countAllForMe(user);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("count-all")
  countAll(@Query() interval: { dateDown: Date, dateUp: Date }, @CurrentUser() user: ProjectManager) {
    this.sentryService.setSentryUser(user);
    return this.sentEmailsService.countAll(interval);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("count-weekly-for-me")
  countWeeklyForMe(@CurrentUser() user: ProjectManager) : Promise<number> {
    this.sentryService.setSentryUser(user);
    return this.sentEmailsService.countWeeklyForMe(user);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("count-all-by-weeks-for-me")
  countAllByWeeksForMe(@CurrentUser() user: ProjectManager) {
    this.sentryService.setSentryUser(user);
    return this.sentEmailsService.countAllByWeeksForMe(user);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Post("send-separately/:idSentEmail")
  sendSeparately(@Param("idSentEmail") idSentEmail: number, @Body() object: { object: string }, @CurrentUser() user: ProjectManager) {
    this.sentryService.setSentryUser(user);
    return this.sentEmailsService.sendSeparately(idSentEmail, object.object)
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Post("create-and-send")
  createAndSend(@Body() content: { createSentEmailDto: CreateSentEmailDto, sendEmailDto: SendEmailDto }, @CurrentUser() user: ProjectManager) : Promise<SentEmail> {
    return this.sentEmailsService.createAndSend(content.createSentEmailDto, user, content.sendEmailDto);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Post("create-and-send-separately")
  createAndSendSeparately(@Body() content: { createSentEmailDto: CreateSentEmailDto, object: string }, @CurrentUser() user: ProjectManager) : Promise<SentEmail> {
    console.log(content)
    return this.sentEmailsService.createAndSendSeparately(content.createSentEmailDto, user, content.object);
  }
}
