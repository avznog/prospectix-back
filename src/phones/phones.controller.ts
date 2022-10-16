import { Body, Controller, Param, Patch, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/annotations/roles.decorator';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesType } from 'src/auth/role.type';
import { SentryInterceptor } from 'src/sentry.interceptor';
import { UpdateResult } from 'typeorm';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { PhonesService } from './phones.service';

@UseInterceptors(SentryInterceptor)
@Controller('phones')
@ApiTags("phones")
@UseGuards(JwtAuthGuard, RolesGuard)
export class PhonesController {
  constructor(private readonly phonesService: PhonesService) {}

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Patch(":id")
  update(@Param("id") idPhone: number, @Body() updatePhoneDto: UpdatePhoneDto) : Promise<UpdateResult> {
    return this.phonesService.update(idPhone, updatePhoneDto);
  }
}
