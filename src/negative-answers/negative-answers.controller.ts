import { Body, Controller, Get, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { Roles } from 'src/auth/annotations/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.model';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesType } from 'src/auth/role.type';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { SentryInterceptor } from 'src/sentry.interceptor';
import { CreateNegativeAnswerDto } from './dto/create-negative-answer.dto';
import { NegativeAnswersService } from './negative-answers.service';

@UseInterceptors(SentryInterceptor)
@Controller('negative-answers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NegativeAnswersController {
  constructor(private readonly negativeAnswersService: NegativeAnswersService) {}

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Post()
  create(@Body() createNegativeAnswerDto: CreateNegativeAnswerDto) {
    return this.negativeAnswersService.create(createNegativeAnswerDto);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Post("create-for-me")
  createForMe(@Body() createNegativeAnswerDto: CreateNegativeAnswerDto, @CurrentUser() user: ProjectManager) {
    return this.negativeAnswersService.createForMe(createNegativeAnswerDto, user);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("count-all-for-me")
  countAllForMe(@CurrentUser() user: ProjectManager) : Promise<number> {
    return this.negativeAnswersService.countAllForMe(user);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("count-weekly-for-me")
  countWeeklyForMe(@CurrentUser() user: ProjectManager) : Promise<number> {
    return this.negativeAnswersService.countWeeklyForMe(user);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("count-all-by-weeks-for-me")
  countAllByWeeksForMe(@CurrentUser() user: ProjectManager) {
    return this.negativeAnswersService.countAllByWeeksForMe(user);
  }
}
