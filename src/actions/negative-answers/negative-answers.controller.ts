import { Body, Controller, Get, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateNegativeAnswerDto } from '../../actions/negative-answers/dto/create-negative-answer.dto';
import { SentryService } from '../../apis/sentry/sentry.service';
import { Roles } from '../../auth/annotations/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.model';
import JwtAuthGuard from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { RolesType } from '../../auth/role.type';
import { SentryInterceptor } from '../../sentry.interceptor';
import { ProjectManager } from '../../users/project-managers/entities/project-manager.entity';
import { NegativeAnswersService } from './negative-answers.service';

@UseInterceptors(SentryInterceptor)
@Controller('negative-answers')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags("negative-answers")
export class NegativeAnswersController {
  constructor(
    private readonly negativeAnswersService: NegativeAnswersService,
    private readonly sentryService: SentryService
    ) {}

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Post()
  create(@Body() createNegativeAnswerDto: CreateNegativeAnswerDto, @CurrentUser() user: ProjectManager) {
    this.sentryService.setSentryUser(user);
    return this.negativeAnswersService.create(createNegativeAnswerDto);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Post("create-for-me")
  createForMe(@Body() createNegativeAnswerDto: CreateNegativeAnswerDto, @CurrentUser() user: ProjectManager) {
    this.sentryService.setSentryUser(user);
    return this.negativeAnswersService.createForMe(createNegativeAnswerDto, user);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("count-all-for-me")
  countAllForMe(@CurrentUser() user: ProjectManager) : Promise<number> {
    this.sentryService.setSentryUser(user);
    return this.negativeAnswersService.countAllForMe(user);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("count-weekly-for-me")
  countWeeklyForMe(@CurrentUser() user: ProjectManager) : Promise<number> {
    this.sentryService.setSentryUser(user);
    return this.negativeAnswersService.countWeeklyForMe(user);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("count-all-by-weeks-for-me")
  countAllByWeeksForMe(@CurrentUser() user: ProjectManager) {
    this.sentryService.setSentryUser(user);
    return this.negativeAnswersService.countAllByWeeksForMe(user);
  }
}
