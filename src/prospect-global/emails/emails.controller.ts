import { Body, Controller, Param, Patch, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SentryService } from '../../apis/sentry/sentry.service';
import { Roles } from '../../auth/annotations/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.model';
import JwtAuthGuard from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { RolesType } from '../../auth/role.type';
import { SentryInterceptor } from '../../sentry.interceptor';
import { ProjectManager } from '../../users/project-managers/entities/project-manager.entity';
import { UpdateResult } from 'typeorm';
import { UpdateEmailDto } from './dto/update-email.dto';
import { EmailsService } from './emails.service';

@UseInterceptors(SentryInterceptor)
@Controller('emails')
@ApiTags("emails")
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmailsController {
  constructor(
    private readonly emailsService: EmailsService,
    private readonly sentryService: SentryService
  ) {}

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Patch(":id")
  update(@Param("id") idEmail: number, @Body() updateEmailDto: UpdateEmailDto, @CurrentUser() user: ProjectManager) : Promise<UpdateResult> {
    this.sentryService.setSentryUser(user);
    return this.emailsService.update(idEmail, updateEmailDto);
  }
}
